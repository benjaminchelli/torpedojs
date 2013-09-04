
(function (window, undefined) {


  /*
   * The Torpedo.Template Class is responsible
   * of the interface with the template processor
   *   e.g.: Handlebars.js
   */



  /*
   * INIT TORPEDO OBJECT
   */
  var Torpedo = window.Torpedo = window.Torpedo || {};


  /*
   * INIT TEMPLATES MANAGER
   */
  var partialId = 0;
  templates = {};
  Torpedo.getTemplate = function(name){
    return templates[name];
  }


  /*
   * TEMPLATE CONSTRUCTOR
   */
  var Template = Torpedo.Template = function(opts){

    // initialize the options
    this._opts   = opts = opts   || {};

    // required options
    var requiredOpts = ['name', 'template'];
    for(var i=0,l=requiredOpts.length;i<l;i++){
      var o = requiredOpts[i];
      if(typeof opts[o] == 'undefined'){
        throw new Error('Required parameter '+o+' is missing');
      }
    }

    // add to the template manager
    templates[opts.name] = this;

    // register the routes
    if(opts.routes) {
      this.routes = opts.routes;
      new Torpedo.Route(this);
    }

    // register the partial
    Handlebars.registerPartial(
      opts.name
    , function(context, options){

        var id = 'torpedo-partial-'+(++partialId)
          , parentView = Torpedo.getActiveView();
          ;

        context = $.extend({}, opts.context, context);

        // render the subview once the container is in place
        setTimeout(function(){

          new Torpedo.View({
            id        : id

          , template  : opts.name
          , events    : opts.events

          , context   : context
          , options   : options

          , parent    : parentView

          , onRendered: function(){
              $('#'+id).append('<div>')
              $('#'+id+' :last').unwrap().remove();
            }
          });

        }, 0);

        return '<div id="'+id+'"></div>';
      }
    );
  };


  /*
   * EXTENDS WITH EVENTS
   */
  _.extend(Template.prototype, Torpedo.Events);


  /*
   * GET HTML
   */
  Template.prototype.getHtml = function(context, options) {
    return this._opts.template(context, options);
  };

})(window);

