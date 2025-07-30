---
title: "Future of Configuration Management"
date: 2019-07-31T16:44:09+02:00
type: "post"
author: "gaelcolas"
weight: 1
---

It's good to make sure we understand the world in which
DSC evolves, so I thought of writing this post below.
Unfortunately, the future is not something we can predict, so this is
just a personal opinion, which I hope you'll find useful.

## Configuration Management evolution

Some like to classify different configuration management models,
but I prefer to show them as an evolution of similar principles,
that happened with the evolution of technology and principles.

<table class="table">
<thead>
<tr>
<th>version</th>
<th>Name</th>
<th>Concepts</th>
</tr>
</thead>

<tbody>
<tr>
<td>0.0</td>
<td>GUI-driven</td>
<td>Changes and abstractions are GUI-Driven</td>
</tr>

<tr>
<td>0.5</td>
<td>Scripted Transform</td>
<td>Code, Deployment Scripts, Imperative, Transformations assume a starting state</td>
</tr>

<tr>
<td>1.0</td>
<td>Policy-Driven Convergence</td>
<td>Declarative Intent, Change Pipeline, Idempotency, drift management, Operation Validation</td>
</tr>

<tr>
<td>2.0</td>
<td>Container Model</td>
<td>Artefact everything, Immutability, microservices</td>
</tr>
</tbody>
</table>


## Unpopular opinion

It might not be a popular opinion, but I don't think Configuration Management
as we know it—Managing configuration drift—will be prevalent in the future.
It is not relevant for ephemeral infrastructure, or serverless. However many
principles, such as artifact managements that are managed in release pipelines,
are transferable to other management models, and are valuable lessons for the future.

That said, not all workload are cloud-native ready, and while the companies
transform or give way to competition, many administrators and systems engineer
will benefit from improving their practices when it comes to managing VM.
Let's be honest here, although we strongly recommend companies to really invest in
their transformation to stay competitive, we know it will take a while—and
a duration no-one can predict—for all industry to change decades
of practices and habits.

The **DSC ecosystem** is a great option when you manage a great chunk of Windows
systems (not exclusively), whether **on-prem** or in a **cloud environment**, and
even more when you're **transitioning to a cloud model** or having a **hybrid approach**.

The **solution** you use, however, may differ greatly depending on your
team's preference, skills, need, and business constraints.

If you need to take away anything from this article is that the clock is ticking,
and both at a personal and company level you need to work towards the future.

Being bogged down in old ways because one tool may not be doing things you need
on paper is foolish, we all know that in practice any solution will not
do things we initially thought it would.
Just start now, adapt, and learn!
