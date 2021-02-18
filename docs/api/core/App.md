# App

## Constructor

### App( parameters : <span class="param">Object</span> )

<a>parameters</a> - (optional) object with properties defining the app's behaviour for [Renderer](api/core/Renderer), [Time](api/core/Time), and [Physics](api/core/Physics). The constructor also accepts no parameters at all. In all cases, it will assume defaults when parameters are missing. The following are additional parameters:

<a>renderer</a> - This can be used to attach the app to an existing [Renderer](api/core/Renderer). Default is **undefined**.

## Properties

### .<a>assets</a> : <span class="param">[AssetManager](api/core/AssetManager)</span>
Provides access to user-defined or component-added assets.

### .<a>currentScene</a> : <span class="param">[Scene](api/core/Scene)</span>
The scene that is currently active in the app. Default is **undefined**.

### .<a>domElement</a> : <span class="param">DOMElement</span>
A canvas where the renderer draws its output. This is automatically created by the renderer in the constructor (if not provided already).

### .<a>input</a> : <span class="param">[Input](api/core/Input)</span>
Reference to the input system.

### .<a>parameters</a> : <span class="param">Object</span>
The same parameter object used in the app constructor. Any modification after instantiation does not change the app.

### .<a>physics</a> : <span class="param">[Physics](api/core/Physics)</span>
Reference to the physics system.

### .<a>renderer</a> : <span class="param">[Renderer](api/core/Renderer)</span>
Reference to the renderer.

### .<a>scenes</a> : <span class="param">Array</span>
Array with app's scenes.

### .<a>time</a> : <span class="param">[Time](api/core/Time)</span>
Reference to the time system.

## Static Properties

### .<a>currentApp</a> : <span class="param">[App](api/core/App)</span>
The most recent app created; scenes created without a specified app uses this property.

## Methods

### .<a>start</a> () : <span class="param">null</span>
Starts executing an update loop that will called every available frame.

### .<a>stop</a> () : <span class="param">null</span>
Stops the ongoing update loop.

### .<a>update</a> ( timestamp : <span class="param">DOMHighResTimeStamp</span> ) : <span class="param">null</span>
Updates the application. This function will update systems and call the update/fixedUpdate functions of all enabled components.
If a timestamp is not provided, the function will use performance.now().

### .<a>dispose</a> () : <span class="param">null</span>
Remove the current rendering context and all the event listeners.

### .<a>addScene</a> ( scene : <span class="param">[Scene](api/core/Scene)</span>, ... ) : <span class="param">this</span>
Adds object as child of this object. An arbitrary number of scenes may be added.