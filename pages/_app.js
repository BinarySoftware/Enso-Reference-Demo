import React, { Component } from 'react'; 
import '../styles/globals.css'

const NAV_OFFSET = 20;

class MyApp extends Component {
  componentDidMount() {
    document.addEventListener("scroll", this.onScroll);
    document.addEventListener("keydown", this.onKeyDown);
    let root = document.documentElement
    root.style.setProperty('--nav-offset', `${NAV_OFFSET}px`)
    this.onScroll()
  }

  onScroll() {
    let relPageOffset = Math.max(window.pageYOffset-NAV_OFFSET,0)
    let shadowSize = Math.min(relPageOffset,40)
    let root = document.documentElement
    root.style.setProperty('--nav-shadow', `${shadowSize}px`)
  }

  onKeyDown(event) {
    let root = document.documentElement
    console.log(event)
    if      (event.key == 'q') { root.style.setProperty('--global-font', 'SF Pro Display'); root.style.setProperty('--global-font-shift', '0') }
    else if (event.key == 'w') { root.style.setProperty('--global-font', 'Sofia Pro'); root.style.setProperty('--global-font-shift', '0') }
    else if (event.key == 'e') { root.style.setProperty('--global-font', 'Causten'); root.style.setProperty('--global-font-shift', '0') }
    else if (event.key == 'r') { root.style.setProperty('--global-font', 'Eina'); root.style.setProperty('--global-font-shift', '-0.25rem') }
    else if (event.key == 't') { root.style.setProperty('--global-font', 'Graphik'); root.style.setProperty('--global-font-shift', '-0.25rem') }
  }

  render() {
    const { Component, pageProps, shopOrigin} = this.props;
    return <Component {...pageProps} />
  }
}
// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

export default MyApp

// let root = document.documentElement;

// document.addEventListener('scroll', function(e) {
//   root.style.setProperty('--nav-shadow', `10px`)
//   console.log("yo")
// });

// er


// if      (event.key == 'Shift') { root.style.setProperty('--global-font', 'Eina'); root.style.setProperty('--global-font-shift', '-0.25rem') }
// else if (event.key == 'q') { root.style.setProperty('--global-font', 'Source Sans Pro'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'w') { root.style.setProperty('--global-font', 'Source Sans Pro'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'e') { root.style.setProperty('--global-font', 'Ubuntu'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'r') { root.style.setProperty('--global-font', 'Nunito'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 't') { root.style.setProperty('--global-font', 'Nunito Sans'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'y') { root.style.setProperty('--global-font', 'Mukta'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'u') { root.style.setProperty('--global-font', 'Barlow'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'i') { root.style.setProperty('--global-font', 'Hind'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'o') { root.style.setProperty('--global-font', 'SF Pro Display'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'p') { root.style.setProperty('--global-font', 'Helvetica Neue'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'a') { root.style.setProperty('--global-font', 'Sofia Pro'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 's') { root.style.setProperty('--global-font', 'Greycliff CF'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'd') { root.style.setProperty('--global-font', 'Codec Pro'); root.style.setProperty('--global-font-shift', '0') }
// else if (event.key == 'f') { root.style.setProperty('--global-font', 'Causten'); root.style.setProperty('--global-font-shift', '0') }
