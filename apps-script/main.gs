// Reference entry points are inert in the public portfolio copy.
function doPost() { return jsonResponse({ ok: false, error: 'demo_only', externalServices: false }); }
function doGet() { return jsonResponse({ ok: false, error: 'demo_only', externalServices: false }); }
function readJsonBody() { return null; }
