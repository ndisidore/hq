---
title: "Train as You Fight: Local Friendly CI"
description: "Paths to CI sanity in 2026 feat. dagger & mise"
pubDate: "Jan 28 2026"
heroImage: "../../assets/images/002-hero.webp"
tags: ["ci", "tools"]
draft: false
---

## CI still hurts in 2026

It seems like we can't go more than a few weeks without reading another [hitjob complaining about GitHub Actions](https://news.ycombinator.com/item?id=46614558). For being such an integral part of a developer's daily ritual, the "push and pray" life with a wall‑o‑YAML is all too common.

Solid advice is to keep your CI workflows dumb – push all real logic to secondary scripts and/or task runners. That certainly helps, but this still leaves questions around the actual execution environment. What tools are installed? Which versions? Can you reproduce failures locally? Or are you stuck in the "change → commit → push → wait" loop for even trivial mistakes?

At some point, "put your logic in scripts" stops being enough and you need a story for the environment and the pipeline itself.

### Anatomy of good CI

When I think about "good CI", this is my basic laundry list:

- [ ] **Locally repeatable**: I can run the exact same pipeline on my machine (or personal environment) that CI runs.
- [ ] **Debuggable**: I can drop into a shell, step through stages, add logging, and iterate without 45‑minute round‑trips.
- [ ] **Typed / structured**: Pipelines are expressed in real languages and APIs, not ad‑hoc YAML; refactors are possible.
- [ ] **Tool‑centric, not vendor‑centric**: CI config is a thin wrapper around scripts/task runners.
- [ ] **Portable (non‑proprietary)**: I can move between CI providers without rewriting the world.
- [ ] **Secure by default**: Secrets and environment access follow a clear trust model, especially when reusing community modules.
- [ ] **Fast via caching**: Content‑hash‑based caching keeps re‑runs snappy instead of reinstalling dependencies every time.

### Bonus Points

- [ ] **Cross‑architecture support**: with a particular focus on ease of use and being available locally.

Looking at this list you're probably waving your arms excitedly and chanting "containers"<sup>1</sup> – and if so, I tend to agree. Containers give you isolation, repeatability, and a natural place to hang caching and cross‑arch builds. But "use containers" is still pretty far from "have a pleasant, programmable CI experience I can run on my laptop."

This is roughly where Dagger comes in.

## Dagger.io: The Promise

Dagger pitches itself as a "local‑first, programmable engine" for building CI/CD pipelines. In practice, that means a few things:

- You write your pipeline as code (Go, TypeScript, Python, etc.), [not as YAML](https://dagger.io/blog/substitute-yaml-with-nouns-and-verbs-in-ci-cd-pipelines).
- Dagger runs that pipeline inside containers via BuildKit, so the environment is isolated and consistent.
- The exact same pipeline can be executed locally, in your favorite CI provider, or on Dagger's own cloud.

In other words, if GitHub Actions is the button you press, Dagger wants to be the thing that actually does the thing.

### Checking boxes with Dagger

On paper, Dagger lines up nicely with the "good CI" checklist:

- **Locally repeatable**: This is a core selling point of dagger.
- **Debuggable**: Because the pipeline is "just code" calling into a container engine, you can sprinkle logs, breakpoints, or even build interactive shells into the flow.
- **Typed / structured**: The SDKs expose a typed API for building pipelines, so you get compiler help and IDE support instead of hoping your YAML is valid.
- **Tool‑centric, not vendor‑centric**: CI config becomes a thin wrapper that runs `dagger` (or a small wrapper script), so swapping CI vendors is mostly about changing that wrapper.
- **Portable**: As long as we have a container runtime we're good to go.
- **Fast via caching**: Like with most container setups, layers and incremental builds help here.
- **Cross‑architecture**: Multi‑arch container builds (amd64 + arm64) are first‑class and well‑documented.

Conceptually, this is very appealing: keep your GitHub Actions YAML boring and small, put the actual intelligence in code that can run anywhere, and let Dagger orchestrate the containerized bits.

## Dagger.io: The Warts

Of course, reality is messier.

Dagger is still relatively young, and you can feel that when you try to adopt it for real production workloads. Some of the friction is just "new project growing pains" (you may be paying some early‑adopter tax), but some of it is structural and worth calling out.

### The Daggerverse and trust

One of the most interesting (and controversial) pieces of the ecosystem is the **Daggerverse** – a catalog of reusable modules that package up common patterns: build Go apps, push images, run linters, etc.

This is great for reuse, but you immediately run into trust questions:

- What's the threat model if you pull a random module that wants access to your directory, environment, or secrets?
- How do you keep private or internal modules separate from public ones, and avoid confusing UX where private modules "pollute" search or look public when they're not?
- How explicit do you need to be about which environment variables are passed into modules, and how do you prevent accidental secret leakage?

The team is clearly thinking about this – there are design discussions about making modules request inputs explicitly, tightening how environment variables flow, and improving private‑module behavior – but right now, adopting Daggerverse modules still requires a bit of security paranoia.

### Go SDK weirdness

As a Go dev, Dagger is both appealing and slightly weird.

- Each module tends to get its own generated Go client under something like `./internal/dagger`, which doesn't quite match the usual "import a library" mental model. <cite>[sauce](https://github.com/dagger/dagger/issues/11417)</cite>
- You're effectively checking in a chunk of generated client code that ties your module to a specific Dagger engine version, so upgrades can feel heavier than bumping a normal dependency.
- Because of the above, you likely want to run the codegen tools like `dagger develop --sdk=go` periodically, and be mindful of Go version mismatches (e.g., `go 1.22` in `go.mod` vs the toolchain Dagger expects).
- Many parts of the go sdk are chainable, but many are not, and it can be a tough mental model to track.

None of this is fatal, but it is "a thing you have to learn" on top of the Dagger mental model itself.

## In production: Dagger to build and manage ARM camera applications

Here's the part where I admit I'm still using Dagger anyway, and in spite of what I've written earlier, I like it and see the potential (just like momma taught me to).

In one of my projects at Terminal Industries, we have a fleet of small ARM‑based camera devices that need:

- Multi‑arch images (linux/amd64 and linux/arm64) built from the same codebase.
- A reproducible toolchain with cross‑compilers and SDKs that we do not want to install on my host and that supports both Mac and Linux devs.
- A pipeline we can run locally on a laptop to debug device‑specific issues before pushing to any CI.

A rough sketch of what Dagger is doing for us:

- Spin up a builder container with the exact cross‑toolchain and dependencies needed for the camera firmware.
- Build multi‑arch images in parallel, using cache mounts so rebuilds are reasonably quick.
- Run a small suite of integration tests that talk to a simulated camera service (or a physical device on my network) from inside the same pipeline.
- Pull the resulting build artifact out of the containerized build process.

### The code

Here's an approximation of one of our build steps. Whether or not you enjoy the syntax is up to the reader.

#### Cross‑compile an Axis ACAP

:::filename
build/acap.go
:::

```go
package build

import (
    "context"
    "fmt"

    "dagger.io/dagger/dag"
)

// BuildAcap cross-compiles the ACAP project located at srcPath
// for the given platform (e.g., "linux/arm64"), and writes the binary
// into outDir on the host.
func BuildAcap(
    ctx context.Context,
  // +default="."
    srcPath string,
  // +default="linux/arm64"
    platform string,
  // +default="./out"
    outDir string,
) error {
    // Ensure the global Dagger connection is closed when done.
    defer dag.Close()

    // Mount the ACAP source from the local host.
    src := dag.Host().Directory(srcPath)

    // Compute output binary name (simple example).
    binName := fmt.Sprintf("acap_%s", platform)

    // Create a build container targeting the specified platform.
    // Here we use an official Go image and rely on Dagger's multi-platform support.
    buildCtr := dag.
        Container().
        WithPlatform(platform).
        From("golang:1.25-alpine").
        WithWorkdir("/src").
        WithMountedDirectory("/src", src).
        // Disable cgo for easier cross compilation.
        WithEnvVariable("CGO_ENABLED", "0").
        // Run the Go build, outputting the binary inside the build container.
        WithExec([]string{"go", "build", "-o", "/src/bin/" + binName, "./..."})

    // Create a Dagger directory with the compiled binary.
    binDir := dag.Directory().WithDirectory("bin", buildCtr.Directory("/src/bin"))

    // Export the compiled binary back to the host outDir.
    if _, err := binDir.Export(ctx, outDir); err != nil {
        return fmt.Errorf("exporting: %w", err)
    }

    return nil
}
```

:::caption
Cross-compiles an [ACAP](https://developer.axis.com/acap) for **ARM64** using Dagger's multi-platform support.
:::

Callable via:

```bash
dagger call build-acap \
    --src-path "." \
    --platform "linux/arm64" \
    --out-dir "./out"
```

This again allows the YAML to be boring, which is exactly how I want it. All the interesting work lives in Go, using containers, and can be executed identically in CI and locally.

#### Ansible + Dagger

We've actually taken it a step further and use a dagger-wrapped ansible setup to assist with fleet and configuration management.

:::filename
run/ansible.go
:::

```go
package main

import (
    "context"

    "dagger.io/dagger/dag"
)

type CI struct{}

// Ansible runs ansible-playbook inside a container using Dagger.
//
// dagger call ansible \
//   --playbook playbooks/example.yml \
//   --inventory inventory \
//   --limit web \
//   --check
func (c *CI) Ansible(
    ctx context.Context,
    // Root of the repository
    // +defaultPath="."
    src *dag.Directory,
    // Inventory directory
    // +defaultPath="inventory"
    inventory *dag.Directory,
    // Playbook to run
    playbook string,
    // +optional
    limit string,
    // +default=false
    check bool,
) (string, error) {
    // Base Ansible Execution Environment
    ctr := dag.
        Container().
        From("ghcr.io/ansible-community/community-ee-base:latest").
        WithWorkdir("/work").
        WithDirectory("/work", src).
        WithDirectory("/inventory", inventory).
        WithEnvVariable("ANSIBLE_FORCE_COLOR", "1")

    // Build ansible-playbook command
    cmd := []string{
        "ansible-playbook",
        playbook,
        "-i", "/inventory",
    }

    if limit != "" {
        cmd = append(cmd, "--limit", limit)
    }

    if check {
        cmd = append(cmd, "--check")
    }

    // Execute and return stdout
    return ctr.
        WithExec(cmd).
        Stdout(ctx)
}
```

:::caption
*Note:* this is a very slimmed down version of our real dagger target, which includes many ancillary functions like building the inventory from cue, loading secrets from the [1Password daggerverse module](https://daggerverse.dev/mod/github.com/replicatedhq/daggerverse/onepassword), setting up the execution environment, etc...<br />
For the simple example here dagger is a bit overkill.
:::

Does Dagger make this setup magically easy? Not really. I still had to learn its APIs, deal with a couple of SDK quirks, and think about how to structure modules. But once the pipeline was in place, the "train as you fight" story is much better than the previous "hope this Bash + YAML dance works the same in Actions as it does on my machine" approach.

## The AI misstep (and refocus on CI)

You can't talk about Dagger in 2025/2026 without mentioning the AI detour.

For a while, a lot of the public messaging was about using Dagger as a platform for AI agents that build pipelines on your behalf – demos with GPTScript and friends generating Dagger pipelines automatically. Technically interesting? Sure. But bolting AI onto a system with the aforementioned warts felt a little bit like adding a self‑driving mode to a car that still has intermittent brake issues.

This almost certainly came about from an attempt to ride the AI wave because CI tooling, for being a pivotal part of a developer's daily life, is hard to monetize. [Earthly’s shutdown post from a few months back](https://earthly.dev/blog/shutting-down-earthfiles-cloud/) is a good example: they explicitly called out how CI compute is treated as a commodity and how OSS undercuts paid offerings.

The good news is that this seems to be correcting. In a [recent Hacker News thread](https://news.ycombinator.com/item?id=46734553), Solomon Hykes explicitly said they "heard the feedback" and are **refocusing on CI**, making Dagger faster, simpler to adopt, and building out a complete CI stack native to Dagger. The promise there is an end‑to‑end system that:

- Keeps the "local‑first, programmable pipelines" model.
- Adds tighter integration, observability, and "magical" features that traditional CI products can't easily match.

I'm cautiously optimistic. A clear CI‑first story, plus some API stability, would go a long way toward justifying the complexity budget of adopting Dagger for more than one or two high‑value pipelines.

## mise – a possible middle ground?

All of this lives on a spectrum.

On one end, you have full custom CI with YAML that knows everything about your app and environment. On the other, you have Dagger‑style programmable pipelines running in containers, maybe with their own CI stack. In between, there's a nice middle ground: tools like **mise**.

mise gives you a way to:

- Declare tool versions (Go, Node, Docker, Dagger, etc.) in a single config so every dev machine and CI runner can be brought to the same state.
- Define repeatable tasks (`mise run test`, `mise run release`, etc.) that wrap whatever build logic you already have.

That gets you surprisingly far toward the checklist:

- **Locally repeatable**: The same `mise run` task runs on your laptop and in CI.
- **Tool‑centric**: Your logic lives in scripts and tasks you own, not in CI YAML.
- **Portable**: CI is again mostly "call into mise," which is easy to move between providers.

More on mise later! #cliffhanger

CI can be pain because YAML, but it's also more than that—it's about environments, feedback loops, and trust.

---

<sup>1</sup> Unless you're a Nix person, in which case we heard you the first 10 times.
