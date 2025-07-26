import React from 'react'
import type { Route } from './+types/about';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Dev Tinder" },
    { name: "description", content: "About Dev Tinder" },
  ];
}

const About = () => {
  return (
    <div>About</div>
  )
}

export default About