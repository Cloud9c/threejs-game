import { ComponentManager } from '../core/ComponentManager.js';
import { ObjectLoader } from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { DRACOLoader } from '../lib/DRACOLoader.js';

// gstatic dependency
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/' );

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader( dracoLoader );

const objectLoader = new ObjectLoader();

class Model {

	init( data ) {

		this.ref = typeof data.asset === 'object' ? data.asset : this.app.assets.get( data.asset );

		if ( this.ref === undefined ) {

			const extension = data.asset.split( '.' ).pop().toLowerCase();

			switch ( extension ) {

				case 'drc':
					dracoLoader.load( data.asset, m => this.onDracoLoad( data.asset, m ), p => this.onProgress( p ), e => this.onError( e ) );
				case 'glb':
				case 'gltf':
					gltfLoader.load( data.asset, m => this.onGLTFLoad( data.asset, m ), p => this.onProgress( p ), e => this.onError( e ) );
					break;
				case 'js':
				case 'json':
				case '3geo':
				case '3mat':
				case '3obj':
				case '3scn':
					objectLoader.load( data.asset, m => this.onLoad( data.asset, m ), p => this.onProgress( p ), e => this.onError( e ) );
					break;

				default:
					console.error( 'Model: invalid model extension ' + extension );

			}

		}

		this.addEventListener( 'enable', this.onEnable );
		this.addEventListener( 'disable', this.onDisable );

	}

	onEnable() {

		if ( this.ref !== undefined )
			this.entity.add( this.ref );

	}

	onDisable() {

		if ( this.ref !== undefined )
			this.entity.remove( this.ref );

	}

	onGLTFLoad( key, result ) {

		const scene = result.scene;
		scene.animations.push( ...result.animations );

		this.onLoad( key, scene );

	}

	onDracoLoad( key, geometry ) {

		const material = new THREE.MeshStandardMaterial();
		const object = new THREE.Mesh( geometry, material );

		this.onLoad( key, object );

	}

	onLoad( key, asset ) {

		this.app.assets.add( key, asset );

		this.ref = asset;

		if ( this.enabled ) this.onEnable();

		this.dispatchEvent( { type: 'load', asset } );

	}

	onProgress( event ) {

		this.dispatchEvent( { type: 'progress', event } );

	}

	onError( event ) {

		console.error( 'Model: failed retrieving asset' );
		this.dispatchEvent( { type: 'error', event } );

	}

}

Model.config = {
	schema: {
		asset: { type: 'asset' },
	}
};

ComponentManager.registerComponent( 'model', Model );
