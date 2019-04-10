# canvas_dynamic_layout
Pseudo elements for dynamically generating and laying out Canvas elements. Totally unsupported. 

---

## installation

This isn't designed to be distributable (or even usable), but if you're crafty you can get it going. It requires Kibana master as of whenever the last commit to this repo was. I can't make any promises otherwise.

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following yarn scripts.

  - `yarn kbn bootstrap`

    Install dependencies and crosslink Kibana and all projects/plugins.

    > ***IMPORTANT:*** Use this script instead of `yarn` to install dependencies when switching branches, and re-run it whenever your dependencies change.

  - `yarn start`

    Start kibana and have it include this plugin. You can pass any arguments that you would normally send to `bin/kibana`

      ```
      yarn start --elasticsearch.hosts http://localhost:9220
      ```
## usage

Whoa whoa whoa. Ok, here's an example. You can probably sort it out from here. At very least you can drop that isn't your workpad and hack right?

```
demodata | 
layoutElements by=project 
 elements={
  positionElement 
   element={markdown {getCell project} font={font align="center" color=#fff size=12 weight=bold}} container={position top=0}
   element={shape "semicircle" fill="#4cbce4" } container={position css='svg {filter: drop-shadow( 2px 2px 2px rgba(0, 0, 0, .3));}'}
 } 
 containers={position top={math '1 - median(price)/max(price)'} height={math 'median(price)/max(price)'} containerStyle={containerStyle overflow="visible"} css='div {text-shadow: 2px 2px #666;}'}
 ```
