import './style.css'
import { UUID } from "uuidjs";
import cytoscape from 'cytoscape';
// @ts-ignore
// import cose from 'cytoscape-cose-bilkent';
// @ts-ignore
import cose from 'cytoscape-dagre';

cytoscape.use(cose)

let cy: cytoscape.Core
type NodeType = 'chapter'|'unit'|'topic'|'microtopic'
type ElementType = (cytoscape.NodeDataDefinition & {type: NodeType}) | (cytoscape.EdgeDataDefinition & {type: NodeType})
interface CytoscapeData {
  nodes: (cytoscape.NodeDataDefinition & {type: NodeType})[]
  edges: cytoscape.EdgeDataDefinition[]
}
interface ImportData {
  units: {
          id: string;
          name: string;
      }[];
  topics: {
          id: string;
          name: string;
          parent: string;
      }[];
  microtopics: {
        id: string;
        name: string;
        parent: string;
    }[];
  edges:{
          source: string;
          target: string;
  }[];
}

cy = createCytoscape({
  "units": [
      {
          "id": "u_bio_8_67",
          "name": "9A Razdel"
      },
      {
          "id": "u_bio_8_68",
          "name": "9B Razdel"
      },
  ],
  "topics": [
      {
          "id" : "t_bio_8_1",
          "name": "Functions",
          "parent": "u_bio_8_67"
      },
      {
          "id" : "t_bio_8_2",
          "name": "Functions 2",
          "parent": "u_bio_8_68"
      },
      {
          "id" : "t_bio_8_3",
          "name": "Functions 3",
          "parent": "u_bio_8_68"
      }
  ],
  "microtopics": [
      {
          "id" : "m_bio_8_1",
          "name": "Functions micro",
          "parent": "t_bio_8_1"
      }, 
      {
          "id" : "m_bio_8_2",
          "name": "Functions 2 micro",
          "parent": "t_bio_8_2"
      }, 
      {
          "id" : "m_bio_8_3",
          "name": "Functions 2 micro2",
          "parent": "t_bio_8_2"
      }, 
      {
          "id" : "m_bio_8_4",
          "name": "Functions 2 micro2",
          "parent": "t_bio_8_3"
      },
  ],
  "edges":[
      {
          "source":"m_bio_8_1",
          "target":"m_bio_8_2"
      },
      {
          "source":"m_bio_8_2",
          "target":"m_bio_8_3"
      },
      {
          "source":"m_bio_8_3",
          "target":"m_bio_8_4"
      }
  ]

})
cy.ready(function() {
  
    // Adjust positions for specific nodes or parents after layout
    cy.nodes().forEach(function(node){
      if (node.data('id') === 'u_bio_8_67' || 'm_bio_8_1' === node.data('id')) { // Adjust 'yourNodeId' as needed
        console.log('doing it');
        
        node.position({ x: -1000, y: -1000 }); // Set the desired position
      } else if (node.data('id') === 'u_bio_8_68' || 'm_bio_8_2' === node.data('id')) {
        console.log('else it');
        
        node.position({ x: 1000, y: 1000 }); // Set the desired position
      }
    });

    cy.forceRender();
})

function createCytoscape(data: ImportData): cytoscape.Core {
  const nodes = data.units.map(el => {
    if (el.id === 'u_bio_8_67') {
      console.log('returning');
      
      return {
        data: {
          ...el,
          bg: 'rgb(255, 172, 48)',
          group: 'units',
        },
        position: {
          x: 0,
          y: 0,
        }
      }
    }

    return {
      data: {
        ...el,
        bg: 'rgb(255, 172, 48)',
        group: 'units',
      }
    }
  })
      .concat(data.topics.map(el => ({
        data: {
          ...el,
          bg: 'rgb(252, 245, 235)',
          group: 'topics',
        }
      })))
      .concat(data.microtopics.map(el => ({
        data: {
          ...el,
          name: '',
          bg: 'rgb(164, 233, 133)',
          group: 'microtopic_containers',
        }
      })))
      .concat(data.microtopics.map(el => ({
        data: {
          ...el,
          id: `${el.id}_data`,
          parent: el.id,
          bg: 'black',
          group: 'microtopics',
        }
      })))
      .concat(data.edges.map(el => ({data: { ...el, id: UUID.generate()}}) as any))
  
  return cytoscape({
    container: document.getElementById('app'),

    elements: nodes,
  
    layout: {
      // name: 'cose-bilkent',
      name: 'dagre',
      // @ts-ignore
      animate: true,
      nodeDimensionsIncludeLabels: true,
      idealEdgeLength: 20,
    },
    wheelSensitivity: 0.2,
    motionBlur: true,
    // maxZoom: 100,
  
    style: [
      {
      "selector": "node",
      "style": {
          "label": "data(name)",
          'font-size': '14px',
          'text-wrap': 'wrap',
          'border-width': '0px',
          "text-valign": "top",
          "text-halign": "left",
          "width": 0.1,
          "height": 0.1,
          "background-color": 'data(bg)',
          "text-background-color": "blue",
          'text-margin-x': 60,
        }
      },
      {
        "selector": "edge",
        "style": {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': 'black',
          'line-color': 'black',
          'width': 2
        }
      }
    ]
  });
}