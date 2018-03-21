export default highlight => ({
  className: 'marker',
  draggable: false,
  icon: {
    path:
      'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
    fillColor: highlight,
    fillOpacity: 0.8,
    labelOrigin: { x: 0, y: -30 },
    strokeWeight: 0
  }
});
