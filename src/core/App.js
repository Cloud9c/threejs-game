import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { AssetManager } from './AssetManager.js';
import { Time } from './Time.js';
import { Input } from './Input.js';

export class App {

	constructor( parameters = {} ) {

		this.parameters = parameters;

		this.renderer = parameters.renderer !== undefined ? parameters.renderer : new Renderer( parameters );
		this.domElement = this.renderer.domElement;

		this.assets = new AssetManager();
		this.time = new Time( parameters );
		this.physics = new Physics( parameters );
		this.input = new Input( this.domElement );

		this.scenes = [];
		this.currentScene = null;

		App.currentApp = this;

		this.physics.addEventListener( 'preStep', () => {

			for ( const type in this.components ) {

				const container = this.components[ type ];
				if ( container[ 0 ] !== undefined && container[ 0 ].fixedUpdate !== undefined )
					for ( let j = 0, lenj = container.length; j < lenj; j ++ )
						container[ j ].fixedUpdate();

			}

		} );

	}

	start() {

		this.renderer.setAnimationLoop( t => this.update( t ) );

	}

	stop() {

		this.renderer.setAnimationLoop( null );

	}

	update( timestamp = performance.now() ) {

		const deltaTime = this.time.update( timestamp / 1000 );

		this.physics.update( this.time.scaledFixedTimestep, deltaTime );

		// update (once per frame)
		for ( const type in this.components ) {

			const container = this.components[ type ];
			if ( container[ 0 ] !== undefined && container[ 0 ].update !== undefined )
				for ( let j = 0, lenj = container.length; j < lenj; j ++ )
					container[ j ].update( deltaTime );

		}

		this.renderer.update();
		this.input.reset();

	}

	dispose() {

		this.renderer.dispose();
		this.input.dispose();

		const audioArray = this.components[ 'audio' ];
		if ( audioArray !== undefined ) {

			for ( let i = 0, len = audioArray.length; i < len; i ++ ) {

				audioArray[ i ].ref.hasPlaybackControl = true;
				audioArray[ i ].ref.setLoop( false );
				if ( audioArray[ i ].ref.source !== null )
					audioArray[ i ].ref.stop();
				audioArray[ i ].ref.hasPlaybackControl = false;

			}

		}

	}

	addScene( scene ) {

		if ( arguments.length > 1 ) {

			for ( let i = 0; i < arguments.length; i ++ ) {

				this.addScene( arguments[ i ] );

			}

			return this;

		}

		if ( scene.app !== null ) {

			scene.app.removeScene( scene );

		}

		scene.app = this;
		this.scenes.push( scene );
		scene.dispatchEvent( { type: 'appadd' } );

		return this;

	}

	removeScene( scene ) {

		if ( arguments.length > 1 ) {

			for ( let i = 0; i < arguments.length; i ++ ) {

				this.removeScene( arguments[ i ] );

			}

			return this;

		}

		const index = this.scenes.indexOf( scene );

		if ( index !== - 1 ) {

			this.scenes.splice( index, 1 );
			scene.app = null;

		}

		return this;

	}

	setScene( scene ) {

		if ( this.currentScene !== scene ) {

			if ( this.scenes.indexOf( scene ) === - 1 )
				this.addScene( scene );

			this.components = scene.components;
			this.currentScene = scene;

			this.renderer._updateScene( scene );
			this.physics._updateScene( scene );

		}

	}

	getSceneById( id ) {

		return this.getSceneByProperty( 'id', id );

	}

	getSceneByName( name ) {

		return this.getSceneByProperty( 'name', name );

	}

	getSceneByProperty( name, value ) {

		for ( let i = 0, len = this.scenes.length; i < len; i ++ ) {

			if ( this.scenes[ i ][ name ] === value )
				return this.scenes[ i ];

		}

		return undefined;

	}

}

App.prototype.isApp = true;
