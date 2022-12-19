+++
title = "Narrow Phase"
date = 2022-12-11T17:14:18+01:00
weight = 5
chapter = true
pre = "<b>> </b>"
+++

# Narrow Phase

## Definition: 
The **narrow phase** is the part when collisions between shapes will be tested with their **actual geometry**. 

It means these collisions are **precise**, but also **performance heavy**.

The **brute way** to do things would be to test every triangle against each other. <br>
However, that would be **too slow**.

Algorithms have been created to make it **faster**. <br>
Most of them use the **properties** of **convex shapes**.

## Requirements: 

For this phase to be useful, it must return : 
- The **point** of collision
- The **normal** of the impact
- The **penetrated distance** between the two shapes

Without that, we wouldn't be able to make a proper <b>collision response</b> afterwards.
