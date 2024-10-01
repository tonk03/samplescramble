{
class AudioPlayer extends HTMLElement {
constructor() {
    super();
    
    this.attachShadow({mode:'open'})
    this.render();
    }   


    render() {
        this.shadowRoot.innerHTML = `
        <audio controls src="borrowed-mp3s/gangster.mp3"></audio>
        `;
    }

    
}

// Define the custom element outside of the class
customElements.define('audio-player', AudioPlayer);
}