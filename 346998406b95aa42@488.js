function _1(htl){return(
htl.html`<h1 style="text-align:center;margin:auto;">Premier League ranking</h1>
<h2 style="text-align:center;margin:auto;font-weight"> </h2>
<p style="text-align:center;margin:auto;">Data Sources: <a href="https://www.premierleague.com/tables?team=FIRST" target="_blank">Premier League Table</a></p>
`
)}

function _2(htl){return(
htl.html`<p style="text-align:center;margin:auto;">As of <b>May 16, 2025</b>, check out the teams with the highest points.</p>`
)}

function _3(html,grammyData,drawPictogramChart){return(
html`${grammyData.map(d => html`
  <div class="card">
    <!-- Rank Badge -->
    <div class="rank-badge">Rank #${d.rank}</div>

    <!-- Left Section -->
    <div class="left-section">
      <img src="${d.image}" alt="Artist" class="artist-image">
      <div class="artist-name">${d.artist}</div>
      <div class="stats">
        Wins: ${d.grammy_wins} | Matches: ${d.grammy_nominations} | Draws: ${d.draws_1}
      </div>
    </div>

    <!-- Right Section -->
    <div class="right-section">
      ${drawPictogramChart(d.grammy_nominations, d.grammy_wins, d.draws_1)}
    </div>
  </div>
`)}`
)}

function _4(htl){return(
htl.html`<p style="text-align:center;margin:auto;">Image Source: <a href="https://www.wikipedia.org/" target="_blank">Premier League Logos from Wikipedia</a></p>`
)}

function _5(md){return(
md`### CSS`
)}

function _6(htl){return(
htl.html`<style>
        .card {
            display: flex;
            width: 100%;
            background: #1E1E1E;
            border-radius: 16px;
            box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
            overflow: hidden;
        }
       .rank-badge {
            background: linear-gradient(135deg, #4169E1, #1E3A8A); 
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            font-family: Arial, sans-serif;
            min-width:40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 255, 255, 0.3);
      }

        .left-section {
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #44150b; 
            color: white;
            padding: 20px;
            text-align: center;
        }
        .artist-image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.6);
            margin-bottom: 5px;
        }
        .artist-name {
            font-size: 25px;
            font-weight: 600;
            margin-bottom: 6px;
        }
        .stats {
            font-size: 15px;
            opacity: 0.85;
        }
        .right-section {
            flex-grow:1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items:center;
            color: #000000;
        }

         .notebook {
            background: #fdfded ; 
            border: 1px solid grey; 
            border-radius: 5px; 
            padding: 1ex; 
            font-family: Arial, sans-serif; 
            font-size: 90%;
            color:#ff2222;
     }
    </style>`
)}

function _7(md){return(
md`### Pictogram Chart`
)}

function _drawPictogramChart(d3,legendData){return(
(NominatedCount, wonCount, drawCount) => {
  // D3.js Margin Convention
  const margin = { top: 70, right: 20, bottom: 20, left: 40 };

  // Set Circle Configurartion
  const circleRadius = 18;
  const circleSpacing = 40;
  const rowSpacing = 40;
  const circlesPerRow = 20;

  const numRows = Math.ceil(NominatedCount / circlesPerRow);
  // Dynamic Chart Width
  const chartWidth = circlesPerRow * circleSpacing + margin.left + margin.right;
  const chartHeight = numRows * rowSpacing + margin.top + margin.bottom;

  // Remove existing SVG before redrawing
  d3.select("svg").remove();

  // Create SVG element and set viewBox for responsiveness
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, chartWidth, chartHeight]) // allows responsiveness
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("style", "max-width: 100%; height: auto;")
    .style("background-color", "#1E1E1E");

  // Create chart container within SVG, adjusted for margins
  const chartContainer = svg
    .append("g")
    .attr("class", "g-chart-container")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create a temporary SVG element to measure text width
  const tempSvg = d3.create("svg").attr("class", "temp-svg");

  // Measure text width dynamically
  const textWidths = legendData.map((d) => {
    const tempText = tempSvg
      .append("text")
      .text(d.label)
      .attr("font-size", "16px");
    const width = tempText.node().getBBox().width; // Get text width
    tempText.remove();
    return width;
  });

  tempSvg.remove(); // Remove temporary SVG after measuring


  const padding = 100; // Space between circle and text
  const legendItemWidths = textWidths.map((width) => width + padding);
  const totalLegendWidth = legendItemWidths.reduce(
    (acc, width) => acc + width,
    0
  );

  // Calculate initial x positions for centering
  let xOffset = (chartWidth - totalLegendWidth) / 2;

  // Create legend container
  const legendContainer = svg
    .append("g")
    .attr("class", "g-legend-container")
    .attr("transform", `translate(${xOffset}, ${margin.top / 6})`);

  // Append legend items
  const legendItems = legendContainer
    .selectAll(".legend-item")
    .data(legendData)
    .join("g")
    .attr("class", "g-legend-item")
    .attr("transform", (d, i) => {
      const xPos = legendItemWidths.slice(0, i).reduce((acc, w) => acc + w, 0);
      return `translate(${xPos}, 0)`;
    });

  // Append circles
  legendItems
    .append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 10)
    .attr("fill", (d) => d.color);

  // Append text
  legendItems
    .append("text")
    .attr("x", 30)
    .attr("y", 12)
    .attr("font-size", "16px")
    .attr("fill", "#ffffff")
    //.attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .text((d) => d.label);

  // Generate data array
  const data = d3.range(NominatedCount);

  // Draw circles using D3 data join
  const circles = chartContainer
    .selectAll(".circle-group")
    .data(data)
    .join("g")
    .attr("class", "circle-group")
    .attr("transform", (d) => {
      let row = Math.floor(d / circlesPerRow);
      let column = d % circlesPerRow;
      return `translate(${column * circleSpacing},${row * rowSpacing})`;
    });

  circles
    .append("circle")
    .attr("r", circleRadius)
    .attr("fill", (d) => {
      if (d < wonCount) return legendData[0].color;
      if (d < wonCount + drawCount) return legendData[2].color;
      return legendData[1].color;
    })
    .style("transition", "fill 0.3s ease, transform 0.2s ease")
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", circleRadius + 2);
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("r", circleRadius);
    });

  // Add text inside circles
  circles
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#000000")
    .text((d) => d + 1);

  return svg.node();
}
)}

function _9(md){return(
md`### Chart Data & Legend Data`
)}

function _grammyData(){return(
[
  {
    rank: 1,
    artist: "Liverpool",
    grammy_nominations: 36,
    grammy_wins: 25,
    draws_1: 8,
    image: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg"
  },
  {
    rank: 2,
    artist: "Arsenal",
    grammy_nominations: 36,
    grammy_wins: 18,
    draws_1: 14,
    image: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
  },
  {
    rank: 3,
    artist: "New Castle United",
    grammy_nominations: 36,
    grammy_wins: 19,
    draws_1: 6,
    image:
      "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg"
  },
  {
    rank: 4,
    artist: "Manchester City",
    grammy_nominations: 36,
    grammy_wins: 20,
    draws_1: 8,
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg"
  },
  {
    rank: 5,
    artist: "Chelsea",
    grammy_nominations:36,
    grammy_wins: 18,
    draws_1: 9,
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg"
  },
  {
    rank: 6,
    artist: "Aston Villa",
    grammy_nominations: 36,
    grammy_wins: 18,
    draws_1: 9,
    image:
      "https://loodibee.com/wp-content/uploads/Aston-Villa-FC-logo.png"
  },
  {
    rank: 7,
    artist: "Nottingham Forest",
    grammy_nominations: 36,
    grammy_wins: 18,
    draws_1: 8,
    image:
      "https://loodibee.com/wp-content/uploads/Nottingham-Forest-FC-logo.png"
  },
  {
    rank: 8,
    artist: "Brentford",
    grammy_nominations: 36,
    grammy_wins: 16,
    draws_1: 7,
    image: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg"
  },
  {
    rank: 9,
    artist: "Hove Albion",
    grammy_nominations: 36,
    grammy_wins: 14,
    draws_1: 13,
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/d0/Brighton_and_Hove_Albion_FC_crest.svg"
  },
  {
    rank: 10,
    artist: "AFC Bournemouth",
    grammy_nominations: 36,
    grammy_wins: 14,
    draws_1: 11,
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg"
  }
]
)}

function _legendData(){return(
[
  { color: "#00ff00", label: "Wins", code: "wins" },
  { color: "#ffb9b9", label: "Matches", code: "Matches" },
  { color: "#fff028", label: "Draws", code: "draws" }
]
)}

function _12(md){return(
md`### Tools and Methodologies`
)}

async function _13(FileAttachment,md){return(
md`<div style="font-family: sans-serif; font-size: 16px; display: flex; align-items: center; gap: 15px;">
  <a href="https://observablehq.com" target="_blank" title="Observable">
    <img src="${await FileAttachment("observablehq.svg").url()}" alt="Observable Notebook" height="30">
  </a>
  <a href="https://d3js.org" target="_blank" title="D3.js">
    <img src="${await FileAttachment("d3-js.svg").url()}" alt="D3.js" height="30">
  </a>
</div>`
)}

function _14(md){return(
md`### References`
)}

function _15(md){return(
md`*[D3.js Docs.](https://d3js.org/getting-started) | [Observable Notebook Docs.](https://observablehq.com/documentation/notebooks/) | [SVG Docs.](https://developer.mozilla.org/en-US/docs/Web/SVG)* `
)}

function _16(md){return(
md`### Acknowledgements`
)}

function _17(md){return(
md`*The author has no acknowledgements to declare for this project.*`
)}

function _18(md){return(
md`### AI Disclosure`
)}

function _19(md){return(
md`*The author utilized AI tools such as Gemini and ChatGPT as coding assistants during the development of this project.*`
)}

function _20(htl){return(
htl.html`<div class="notebook">
  <div style="font-weight: bold">⚠️ Disclaimer ⚠️</div>
   This project provides data visualizations for informational purposes only. While we aim for accuracy, the data may contain errors or omissions. It should not be used as financial, legal, or professional advice. We are not responsible for any decisions made based on this information. Use at your own discretion.
</div>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["d3-js.svg", {url: new URL("./files/2ee393443444598c3bbb1bc9e8429f94082c554d0416d7387c9a922bee321f15ec5517a960337287df04bd6840f622c86b2973cc0838588624410bda2947725e.svg", import.meta.url), mimeType: "image/svg+xml", toString}],
    ["observablehq.svg", {url: new URL("./files/7b00535015de4221b2d494d874d553dd6191847306cefb742201564faa13f9015142b4bcc06672b796e3a27435726df6c2049e76a7fb8b0cbaa73470325fe17c.svg", import.meta.url), mimeType: "image/svg+xml", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["htl"], _1);
  main.variable(observer()).define(["htl"], _2);
  main.variable(observer()).define(["html","grammyData","drawPictogramChart"], _3);
  main.variable(observer()).define(["htl"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["htl"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("drawPictogramChart")).define("drawPictogramChart", ["d3","legendData"], _drawPictogramChart);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("grammyData")).define("grammyData", _grammyData);
  main.variable(observer("legendData")).define("legendData", _legendData);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["FileAttachment","md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["htl"], _20);
  return main;
}
