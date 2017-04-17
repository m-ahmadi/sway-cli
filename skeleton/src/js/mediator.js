define([
	"core/util",
	"core/pubsub",
	"./templates"
], (u, newPubSub) => {
	const inst = u.extend( newPubSub() );
	
	function addCustomEvts() {
		
	}
	function beforeReady() {
		
	}
	function onReady() {
		addCustomEvts();
	}
	
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	
	return inst;
});