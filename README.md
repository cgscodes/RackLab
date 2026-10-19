# RackLab

RackLab is an interactive 3D server-rack configurator built with React, TypeScript, and React Three Fiber. Users can place equipment into an 18U rack, manage capacity and power constraints, and save a configuration locally.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production output is written to `dist/` and can be deployed to Vercel, Netlify, Firebase Hosting, or another static host.

## Controls

- Select equipment from the left panel.
- Click an available rack unit to install it.
- Click installed equipment to remove it.
- Drag the 3D scene to orbit and scroll to zoom.
- Configurations are saved in the browser with `localStorage`.

## Project scope

This one-day portfolio prototype intentionally uses simple Three.js geometry instead of external models. It has no backend or authentication.
