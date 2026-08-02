# Preflop Explorer

**A public reference implementation of a 6-max preflop range explorer and poker study interface powered by [Pokerai API](https://pokerai.bet/).** Follow real action trees, compare consecutive player ranges, and inspect exact raise, call, and fold frequencies across every hand in a 13×13 grid.

[Open the live Preflop Explorer →](https://pokerai.bet/preflop-explorer/) · [Read the product case →](https://pokerai.bet/examples/preflop-explorer) · [Build with Pokerai API →](https://pokerai.bet/guides/build-a-gto-trainer)

[![Preflop Explorer comparing two 6-max mixed-strategy poker ranges](https://pokerai.bet/assets/showcases/preflop-explorer-compare.webp)](https://pokerai.bet/preflop-explorer/)

## What is Preflop Explorer?

Preflop Explorer is a browser-based tool for studying presolved 6-max Texas Hold'em ranges. Start at the root of an action tree, choose each legal action, and keep the previous player's range beside the current decision. Select any starting hand to inspect its exact mixed-strategy frequencies.

The hosted product is ready to use with a Pokerai account. You do not need to clone this repository or put an API key in a browser.

| Study task | What the explorer provides |
| --- | --- |
| Browse a preflop spot | Legal actions are presented as a navigable action tree. |
| Read a complete range | Every decision uses the standard 169-class, 13×13 starting-hand grid. |
| Understand mixed strategy | Split cells show the exact raise, call, and fold mix instead of forcing one action. |
| Compare adjacent decisions | The previous and current player's ranges stay at the same scale for direct comparison. |
| Inspect one hand | Open any grid cell to see the action frequencies for that hand class. |

## Try it before you build it

1. Open the [live Preflop Explorer](https://pokerai.bet/preflop-explorer/).
2. Sign in with your Pokerai account.
3. Select the supported 6-max presolved tree.
4. Follow an action line and compare the ranges at each decision.
5. Click a hand such as `A5s`, `99`, or `KQo` to inspect its mixed frequencies.

Version metadata and action-tree navigation do not consume presolved quota. The first successful load of a strategy node consumes one unit of the signed-in user's own quota; reopening that node in the same session uses the client cache.

## A working reference app for Pokerai API

Preflop Explorer is both a useful study tool and a reference implementation for developers building poker products. The interface demonstrates the product layer; [Pokerai API](https://pokerai.bet/docs) supplies the strategy and solving infrastructure behind it.

Use the same API foundation to create a product that fits your own workflow:

- a branded preflop range browser for a poker community or training site;
- position, action-line, or hand-class quizzes with custom grading rules;
- spaced-repetition drills and leak-focused study queues;
- hand-history review that links played decisions to reference strategy;
- coaching dashboards, progress tracking, and team study tools;
- analysis workflows that extend beyond presolved preflop data into Pokerai's documented postflop and solver APIs.

Start with the [GTO trainer guide](https://pokerai.bet/guides/build-a-gto-trainer), inspect the [API reference](https://pokerai.bet/reference), or use the machine-readable [OpenAPI specification](https://pokerai.bet/openapi.en.json).

## Architecture and security boundary

```text
browser
  │ signed-in user's Bearer JWT
  ▼
/v1/apps/preflop-explorer/{meta,tree,strategy}
  │ authenticate user
  │ validate requested action-tree node
  │ consume the user's own quota after a successful strategy response
  ▼
Pokerai Preflop strategy service
```

The public client contains no Pokerai API key, fixed JWT, platform token, strategy database, or third-party credential. The hosted explorer uses a same-origin user session. Developers building a separate product should call Pokerai API from their own trusted backend and keep API credentials server-side.

See [docs/API_CONTRACT.md](docs/API_CONTRACT.md) for the Explorer endpoint contract and [SECURITY.md](SECURITY.md) for reporting security issues.

## Run locally

Requirements: Node.js 22+.

```sh
git clone https://github.com/pokerai-bet/PreflopExplorer.git
cd PreflopExplorer
npm install
cp .env.example .env.local
npm run dev
```

Only configure the public API base URL in `.env.local`. Never place an API key or token in a `VITE_` environment variable because Vite exposes those values to the browser bundle.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Frequently asked questions

### Is Preflop Explorer a poker range chart?

It is interactive rather than a static chart. You can follow a legal 6-max action line, compare consecutive ranges, and inspect mixed frequencies for all 169 starting-hand classes.

### Is it a preflop trainer?

It supports range study and decision review. The open-source interface is also a starting point for building quizzes, spaced repetition, grading, and other training modes with Pokerai API.

### Does the browser expose a Pokerai API key?

No. The hosted app uses the signed-in user's same-origin JWT and a controlled Explorer endpoint. If you build your own application, keep your Pokerai API key in a trusted server environment.

### Can I customize it for another poker workflow?

Yes. Fork the UI for your own navigation and training experience, then use the documented Pokerai preflop, postflop, or solver endpoints that match your product. The API contract, quota, and available spot coverage remain defined by Pokerai API.

## Responsible use

Preflop Explorer is designed for off-table study and product development. It is not a real-time assistance tool and must not be used to provide prohibited assistance at live real-money tables.

## Links

- **Use the product:** [pokerai.bet/preflop-explorer](https://pokerai.bet/preflop-explorer/)
- **Read the full case:** [Preflop Explorer product case](https://pokerai.bet/examples/preflop-explorer)
- **Build a trainer:** [Build a GTO poker trainer](https://pokerai.bet/guides/build-a-gto-trainer)
- **API documentation:** [Pokerai API Docs](https://pokerai.bet/docs)
- **API reference:** [Pokerai API Reference](https://pokerai.bet/reference)
- **Implementation plan:** [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)

## License and data

The source code in this repository is licensed under the [Apache License 2.0](LICENSE). You may use, modify, and distribute the code subject to that license and the attribution information in [NOTICE](NOTICE).

The code license does **not** grant rights to Pokerai strategy data, presolved ranges, API access, credentials, quotas, hosted services, trademarks, or logos. Those assets and services are not part of the licensed work and remain subject to their applicable Pokerai terms. In particular, do not extract or redistribute strategy responses unless the applicable service terms expressly permit it.
