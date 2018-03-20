export default highlight => ({
  className: 'marker',
  draggable: false,
  icon: {
    path:
      'M27.648-41.399q0-3.816-2.7-6.516t-6.516-2.7-6.516 2.7-2.7 6.516 2.7 6.516 6.516 2.7 6.516-2.7 2.7-6.516zm9.216 0q0 3.924-1.188 6.444l-13.104 27.864q-.576 1.188-1.71 1.872t-2.43.684-2.43-.684-1.674-1.872l-13.14-27.864q-1.188-2.52-1.188-6.444 0-7.632 5.4-13.032t13.032-5.4 13.032 5.4 5.4 13.032z',
    fillColor: highlight,
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 0.65,
    anchor: { x: 21, y: 0 },
    origin: { x: 0, y: 0 },
    labelOrigin: { x: 21, y: -40 }
  }
});
