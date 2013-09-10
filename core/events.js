(function(){

  /*
   * INIT TORPEDO OBJECT
   */
  var Torpedo = window.Torpedo = window.Torpedo || {};


  /*
   * HELPERS
   */
  function initEventStack(obj){
    if(!obj._evStack){
      obj._evStack = {};
      obj._evId = 0;
    }
  }


  /*
   * EVENTS
   */
  var Events = Torpedo.Events = {
        on:function(key, cb){
          initEventStack(this);
          this._evStack[key] = this._evStack[key] || [];
          this._evId++;
          cb._evId = this._evId;
          this._evStack[key].push(cb);
        }
      , off:function(key, cb){
          initEventStack(this);
          if(!_.isArray(this._evStack[key])) return;
          var evs = this._evStack[key];
          for(var i=evs.length-1;i>=0;i--){
            if(evs[i]._evId === cb._evId){
              evs.splice(i, 1);
            }
          }
        }
      , once:function(key, cb){
          cb._once = true;
          this.on(key, cb);
        }
      , trigger:function(key, obj){
          var self = this;
          initEventStack(this);
          if(!_.isArray(this._evStack[key])) return;
          var evs = this._evStack[key];
          for(var i=evs.length-1;i>=0;i--){
            setTimeout((function(cb){
              return function(){
                // trigger
                if(cb) cb(obj);
                // remove if once
                if(cb._once) self.off(key, cb);
              }
            })(evs[i]), 0);
          }
        }
      }
    ;

  // Allow the `Torpedo` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Torpedo, Events);


})();