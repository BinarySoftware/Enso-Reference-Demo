import Head from "next/head";

import CloudIcon from '../public/img/icon/cloud.svg';
import CommunityIcon from '../public/img/icon/community.svg';
import DesktopIcon from '../public/img/icon/desktop.svg';
import ArrowLeftIcon from '../public/img/icon/arrow-left.svg';
import ArrowRightIcon from '../public/img/icon/arrow-right.svg';
import DiscordLogo from '../public/img/logo/companies/discord.svg';
import GithubLogo from '../public/img/logo/companies/github.svg';
import DiagonalSplit from '../public/img/bg/diagonal-split.svg';
import DiagonalSplitWhiteDark from '../public/img/bg/diagonal-split-white-dark.svg';
import DiagonalLines from '../public/img/bg/diagonal-lines.svg';

import WorkflowIcon from '../public/img/icon/workflow.svg';
import LabIcon from '../public/img/icon/lab.svg';
import PerformanceIcon from '../public/img/icon/performance.svg';
import ReproResultsIcon from '../public/img/icon/repro-results.svg';

import EnsoLogo from '../public/img/logo/lang/enso.svg'
import LanguageLayersSvg from '../public/img/infographics/enso-language-layers.svg'

import getConfig from 'next/config'

const {createRef, useState, useEffect} = React

const { serverRuntimeConfig } = getConfig()


// =============
// === Utils ===
// =============

/// A seed-based number generator. For the given seed, it returns a random 
/// generator function. Call it to get the next random number.
/// 
/// Lehmer random number generator
/// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
function seedRandom(seed) {
    return function() {
        seed = Math.imul(48271,seed) | 0 % 2147483647;
        return (seed & 2147483647) / 2147483648;
    }
}

/// Shuffles the provided array in random way by using the provided random
/// number generator. For example, you can call it with the `seedRandom`
/// function as `shuffle([1,2,3,4],seedRandom(15))`.
///
/// Fisher–Yates Shuffle
/// https://bost.ocks.org/mike/shuffle/
function shuffle(inArray,rand) {
    let array        = inArray.slice()
    let currentIndex = array.length
    let temporaryValue
    let randomIndex
    while (0 !== currentIndex) {
      randomIndex   = Math.floor(rand() * currentIndex)
      currentIndex -= 1
  
      temporaryValue      = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex]  = temporaryValue
    }
    return array;
}



// =======================================
// === Compile-time Content Generation ===
// =======================================

/// Called during compile-time by Next.js.
export async function getStaticProps() {
    let marketplaceBackground = generateMarketplaceBackground()
    let dottedBackground      = generateDottedBackground()
    return {
        props: {marketplaceBackground,dottedBackground}
    }
}

/// Compile-time generation of the marketplace backgound animated tiles.
///
/// This function reads icons svg shapes from the disk and inlines them
/// in the generated SVG code. The code is then used as content of a React
/// component. This way, the costly generation is performed during compilation
/// phase only.
function generateMarketplaceBackground() {
    const fs  = require('fs')
    let path  = `${serverRuntimeConfig.PROJECT_ROOT}/public/img/marketplace`
    let names = fs.readdirSync(path)
    let svgs  = names.map(name => fs.readFileSync(`${path}/${name}`,'utf8'))
    return generateBackgroundTiles(Object.assign(backgroundTilesDefaultConfig(),{
        icons: svgs,
        centerIndexY: 7,
        blacklist: [new Rect(-6,2,6,4), new Rect(-9,7,9,12)],
    }))
}

function generateDottedBackground() {
    return generateBackgroundTiles(Object.assign(backgroundTilesDefaultConfig(),{
        minTileScale: 0.1,
        maxTileScale: 0.1,
    }))
}



// ==================================
// === Generic Content Generation ===
// ==================================

function backgroundTilesDefaultConfig() {
    return {
        icons: [],
        tileSize: 52,
        minTileScale: 0.1,
        maxTileScale: 1,
        iconSize: 40,
        tileRadius: 6,
        tileGap: 8,
        countX: 27,
        countY: 22,
        maxOpacity: 1,
        minOpacity: 0.1,
        opacityMult: 1.5,
        opacityPower: 3,
        centerIndexX: null,
        centerIndexY: null,
        centerIconsRandomSeed : 242,
        sideIconsRandomSeed: 587,
        missingPatternRandomSeed : 519,
        opacityPatternRandomSeed : 123,
        colorRandomSeed: 758,
        colors: [['rgb(72 118 212)',10],['rgb(217,80,64)',1],['rgb(241,189,65)',1],['rgb(88,165,92)',1]],
        blacklist: [],
    }
}

function generateBackgroundTiles(cfg) {
    let iconAlphaThreshold = 0.3
    let missingThreshold   = 0.3

    var centerIconsRandom    = seedRandom(cfg.centerIconsRandomSeed)
    var sideIconsRandom      = seedRandom(cfg.sideIconsRandomSeed)
    var missingPatternRandom = seedRandom(cfg.missingPatternRandomSeed)
    var opacityPatternRandom = seedRandom(cfg.opacityPatternRandomSeed)
    var colorRandom          = seedRandom(cfg.colorRandomSeed)

    let centerIndexX = Math.floor(cfg.countX / 2)
    let centerIndexY = Math.floor(cfg.countY / 2)
    if (cfg.centerIndexX !== null) { centerIndexX = cfg.centerIndexX }
    if (cfg.centerIndexY !== null) { centerIndexY = cfg.centerIndexY }

    let iconPadding = (cfg.tileSize - cfg.iconSize) / 2

    let colors = []
    for (let [color,rep] of cfg.colors) {
        for (let i=0; i<rep; i++) {
            colors.push(color)
        }
    }

    let centerIcons     = shuffle(cfg.icons,centerIconsRandom)
    let sideIcons       = shuffle(cfg.icons,sideIconsRandom)
    let centerIconsIter = {refill:centerIcons, elems:[]}
    let sideIconsIter   = {refill:sideIcons, elems:[]}

    let jump    = cfg.tileSize + cfg.tileGap 
    let width   = cfg.countX * jump
    let height  = cfg.countY * jump
    let generateTile = (xIndex,yIndex,color,a) => {
        let x           = xIndex*jump+cfg.tileSize/2
        let y           = yIndex*jump+cfg.tileSize/2
        let distX       = Math.abs(centerIndexX - xIndex)
        let distY       = Math.abs(centerIndexY - yIndex)
        let dist        = Math.sqrt(distX*distX + distY*distY)
        let delay       = 3*Math.pow(dist/3,1.5)/10 + Math.pow(1 - a,2)*1.5
        let scale       = Math.min(cfg.maxTileScale,Math.max(cfg.minTileScale,(16 - dist) / 16))
        let overScale   = scale * 1.2
        let contraScale = scale / overScale
        let iconOpacity = Math.pow(scale,0.5)
        let icon        = ""
        if (a >= iconAlphaThreshold && cfg.icons.length !== 0) {
            let iter = centerIconsIter
            if (distX > 7) {
                iter = sideIconsIter
            }
            let iconPath = iter.elems.pop()
            if (!iconPath) {
                iter.elems = iter.refill.slice()
                iconPath  = iter.elems.pop()
            }
            icon = `
                <svg 
                    class   = "icon"
                    width   = "${cfg.iconSize}" 
                    height  = "${cfg.iconSize}" 
                    x       = "${iconPadding}" 
                    y       = "${iconPadding}" 
                    opacity = "${iconOpacity}" 
                    style   = "transition-delay:${delay}s" 
                    ${iconPath.slice(4)}`
        }

        let background = `
            <rect 
                fill   = "${color}" 
                width  = "${cfg.tileSize}" 
                height = "${cfg.tileSize}" 
                rx     = "${cfg.tileRadius}"
            />`

        let opacity = a * Math.max(0, 1 - distX / 14)
        let contentTransform = `translate(${-cfg.tileSize/2},${-cfg.tileSize/2})`
        let content = `
            <g opacity="${opacity}" transform="${contentTransform}">
                ${background}
                ${icon}
            </g>
        `

        // This element is used as a shrink animation in the 2-step tile 
        // animation process (grow -> shrink).
        let insideDelay = `transition-delay:${delay + 0.4}s`
        let insideScale = `transform:scale(${contraScale})`
        let inside      = `
            <g class="inside" style="${insideDelay};${insideScale};">
                ${content}
            </g>
        `

        let tileDelay  = `transition-delay:${delay}s`
        let tileScale  = `transform:scale(${overScale})`
        let tileCenter = `translate(${x},${y})`
        return `
            <g transform="${tileCenter}">
                <g class="tile oo-${xIndex}-${yIndex}" style="${tileDelay}; ${tileScale};">
                    ${inside}
                </g>
            </g>`
    }

    let shapeMap = {}
    let content = ""
    for (let iy=0; iy<cfg.countY; iy++) {
        for (let ix=0; ix<cfg.countX; ix++) {    
            let locX       = ix - centerIndexX
            let skipRandom = missingPatternRandom() <= missingThreshold
            if(!skipRandom) {
                let rand        = Math.min(1,Math.max(0,Math.pow(opacityPatternRandom()*cfg.opacityMult,cfg.opacityPower)))
                let opacityDiff = Math.round(10 * (cfg.maxOpacity - cfg.minOpacity) * rand)/10
                let opacity     = cfg.minOpacity + opacityDiff
                let color       = colors[Math.round((colors.length - 1) * colorRandom())]
                shapeMap[[locX,iy]] = generateTile(ix,iy,color,opacity)
            }
        }
    }

    for (let rect of cfg.blacklist) {
        if (rect.x > rect.x2 || rect.y > rect.y2) {
            throw "Invalid rect."
        }
        for (let x = rect.x; x <= rect.x2; x++) {
            for (let y = rect.y; y <= rect.y2; y++) {
                delete shapeMap[[x,y]]
            }
        }
    }

    for (let shapeIx in shapeMap) {
        content += shapeMap[shapeIx]
    }

    return `
        <svg xmlns="http://www.w3.org/2000/svg" 
            fill="none" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                ${content}
        </svg>`
}



/// ===============
/// === Content ===
/// ===============

function Header({ children, sticky=false, className, ...rest }){
    const [isSticky, setIsSticky] = useState(false)
    const ref = React.createRef()
    className = className ? className : ""
    
    // mount 
    useEffect(() => {
        const cachedRef = ref.current
        const observer  = new IntersectionObserver(
            ([e]) => {
                setIsSticky(e.intersectionRatio < 1)
            },
            {threshold: [1]}
        )
        observer.observe(cachedRef)
      
        // unmount
        return function(){
            observer.unobserve(cachedRef)
        }
    }, [])
    
    return (
        <div className={className} ref={ref} {...rest}>
            <div className={" z-50 fixed w-full sub-nav " + (isSticky ? "sub-nav-visible" : "sub-nav-hidden")}>
                {children}
            </div>
        </div>
    )
}


function LanguageLayers({ children, sticky=false, className, ...rest }){
    const [doesIntersect, setIntersect] = useState(false)
    const ref = React.createRef()
    className = className ? className : ""
    
    // mount 
    useEffect(() => {
        const cachedRef = ref.current
        const observer  = new IntersectionObserver(
            ([e]) => {
                setIntersect(e.isIntersecting)
                console.log("!",e.isIntersecting)
            },
            {threshold: [1]}
        )
        observer.observe(cachedRef)
      
        // unmount
        return function(){
            observer.unobserve(cachedRef)
        }
    }, [])
    
    return (
        <div className={className + " language-layers " + (doesIntersect ? "expanded" : "collapsed")} ref={ref} {...rest}>
            <LanguageLayersSvg/>
        </div>
    )
}


class Rect {
    constructor(x,y,x2,y2) {
        this.x  = x
        this.y  = y
        this.x2 = x2
        this.y2 = y2
    }
}

function MarketplaceBackground({ rootProps, className, ...rest }) {
    const [doesIntersect, setIntersect] = useState(false)
    const ref = React.createRef()
    
    // mount 
    useEffect(() => {
        const cachedRef = ref.current
        const observer  = new IntersectionObserver(
            ([e]) => {
                setIntersect(e.isIntersecting)
            },
            {threshold: [0.3]}
        )
        observer.observe(cachedRef)
      
        // unmount
        return function(){
            observer.unobserve(cachedRef)
        }
    }, [])


    return (
        // FIXME: why z-index is needed here?
        <div style={{zIndex:'-10'}}>
            <div ref={ref}
                className = {className + " marketplace-background" + (doesIntersect ? " animate-marketplace-background" : " hidden-marketplace-background")} 
                dangerouslySetInnerHTML = {{__html:rootProps.marketplaceBackground}}
            />
        </div>
    )
}


function DottedBackground({ rootProps, className, ...rest }) {
    return (
        <div>
            <div
                className = {className} 
                dangerouslySetInnerHTML = {{__html:rootProps.dottedBackground}}
            />
        </div>
    )
}


class Container extends React.Component {
    render() {
        return (
            <div className="mx-auto w-full xlm:container" style={{maxWidth:"1200px"}}>
                <div className="pl-6 pr-6">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
  

class SubSection extends React.Component {
    render() {
        return (
            <div className="absolute w-screen left-1/2 overflow-hidden" style={{marginLeft: '-50vw'}}>
                <Container>
                    {this.props.children}
                </Container>
            </div>
        )
    }
}


export default function Main(props) {
    return (
        <div>
            <Head>
                {/* TODO: Font preload. */}
                <script src="script/main_page.js"></script>
            </Head>

            {/* NAVIGATION */}

            <div style={{height:'var(--nav-offset)'}}></div>
            <div className="w-full bg-white z-50">
                
                <Container className="flex justify-center">
                    <nav className="flex w-full h-16 pl-4 pr-4">
                        <div className="flex w-full justify-between">
                            <div className="self-center" href="#">
                                <div className="flex text-base">
                                    <EnsoLogo className="h-8 self-center mr-8 fill-current text-accent-dark"/>
                                    <a href="#" className="self-center block mr-8 text-accent-dark font-bold">
                                        <p>Enso for Data Science</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Enso for Data Visualization</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Enso Platform</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Marketplace</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Learn</p>
                                    </a>
                                </div>
                            </div>
                            <div className="flex self-center">
                                {/* <button className="button2-subtle-narrow mr-2">
                                    <p>Get Enso Desktop</p>
                                </button> */}
                                {/* <a className="button2-narrow" href="/get">
                                    <p>Get Enso</p>
                                </a> */}
                                <a className="text-accent-important font-bold" href="#">
                                    Log in →
                                </a>
                            </div>
                        </div>
                    </nav>
                </Container>
            </div>
            
            
            {/* <Header className="absolute mt-12">
                <Container>
                    <nav className="mt-4 flex w-full pl-4 pr-4 pt-3 pb-3 nav-shadow rounded-full">
                        <div className="flex w-full justify-between">
                            <div className="self-center" href="#">
                                <div className="flex text-base">
                                    <EnsoLogo className="h-8 self-center mr-8 fill-current text-accent-dark"/>
                                    <a href="#" className="self-center block mr-8 text-accent-dark font-bold">
                                        <p>Data Automation</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Self-Service Analytics</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Advanced Development</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Live Insights</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Makrketplace</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Learn</p>
                                    </a>
                                    <a href="#" className="self-center block mr-8 text-accent-dark">
                                        <p>Contact</p>
                                    </a>
                                </div>
                            </div>
                            <div className="flex self-center">
                                <a className="button2-narrow" href="/get">
                                    <p>Get Enso</p>
                                </a>
                            </div>
                        </div>
                    </nav>
                </Container>
            </Header> */}

            <Header className="absolute mt-12">
                <Container>
                    <nav className="mt-4 flex w-full pl-4 pr-4 pt-3 pb-3 nav-shadow rounded-full">
                        <div className="flex w-full justify-between">
                            <div className="self-center" href="#">
                                <div className="flex text-base">
                                    <EnsoLogo className="h-8 self-center mr-6 fill-current text-accent-dark"/>
                                    <a href="#" className="self-center block mr-6 text-accent-dark font-bold">
                                        <p>For Business Experts</p>
                                    </a>
                                    <a href="#" className="self-center block mr-6 text-accent-dark">
                                        <p>For Tech Experts</p>
                                    </a>
                                    <a href="#" className="self-center block mr-6 text-accent-dark">
                                        <p>For Business Owners</p>
                                    </a>
                                    
                                </div>
                            </div>
                            <div className="flex">
                                <a href="#" className="ml-8 self-center block mr-6 text-accent-dark">
                                    <p>Marketplace</p>
                                </a>
                                <a href="#" className="self-center block mr-6 text-accent-dark">
                                    <p>Learn</p>
                                </a>
                                <a href="#" className="self-center block mr-6 text-accent-dark">
                                    <p>Community</p>
                                </a>
                                <a href="#" className="self-center block mr-6 text-accent-dark">
                                    <p>Contact</p>
                                </a>
                                <div className="flex self-center">
                                    <a className="button2-narrow" href="/get">
                                        <p>Get Enso</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </Container>
            </Header>

            {/* BODY */} 
            
            <div>
                {/* HERO */}
                <Container>
                    <div className="flex justify-center h-screen w-full mx-auto -mb-12" style={{minHeight: "24rem", maxHeight: "70rem"}}>
                        {/* <div className="-mt-40"> */}
                            <div className="flex justify-center items-center">
                                <div className="-mt-36 text-2xl md:text-6xl font-extrabold text-accent-dark leading-3 md:leading-tight">
                                    {/* <div className="flex justify-center">
                                        All your data and analytics.
                                    </div>
                                    
                                    <div className="flex justify-center font-semibold mt-2">
                                        <div>
                                            <span className="text-accent-important">Unified</span><b>.</b> 
                                            <span className="text-accent-important"> Interactive</span><b>.</b> 
                                            <span className="text-accent-important"> Collaborative</span><b>.</b> 
                                        </div>
                                    </div> */}

                                    {/* <div className="text-center">
                                        The most <span className="text-accent-important">intuitive</span><br/>
                                        <span className="text-accent-important">Data Science</span> platform in the world.
                                    </div> */}

                                    {/* <div className="text-center">
                                        The most<br/>
                                        <span className="text-accent-important">intuitive data science</span><br/>
                                        platform in the world.
                                    </div> */}
{/* 
                                    <div className="text-center">
                                        <span className="font-normal">The most</span><br/>
                                        <span className="text-accent-important">intuitive data science</span><br/>
                                        <span className="font-normal">platform in the world.</span>
                                    </div> */}

                                    <div className="text-center">
                                        <span className="opacity-30 text-accent-important">The most</span><br/>
                                        <span className="text-accent-important">intuitive data science</span><br/>
                                        <span className="opacity-30 text-accent-important">platform in the world.</span>
                                    </div>

                                    {/* <div className="text-center">
                                        The most <span className="text-accent-important">intuitive data science</span> platform<br/>
                                        in the world.
                                    </div> */}
                                    
                                    {/* <div className="flex justify-center font-semibold mt-2">
                                        <div>
                                            <span className="text-accent-important">Unified</span><b>.</b> 
                                            <span className="text-accent-important"> Interactive</span><b>.</b> 
                                            <span className="text-accent-important"> Collaborative</span><b>.</b> 
                                        </div>
                                    </div> */}

                                    <div className="mt-12 flex justify-center">
                                        <a className="button2" href="#">
                                            <p>Get Enso</p>
                                        </a>
                                        <a className="ml-4 button2-open" href="#">
                                            <p>Watch Demo</p>
                                        </a>
                                        {/* <a className="ml-4 self-center text-base text-accent-important font-bold" href="#">
                                            <p>Watch Demo →</p>
                                        </a> */}
                                    </div>
                                </div>
                                

                            {/* </div> */}
                            
                        </div>
                    </div>
                                


                        <div className="flex justify-center">
                            <p className="text-content-title text-h1 font-semibold text-center">Save <span className="text-accent-important">3 days a week</span> each Data Analyst<br/><span className="text-accent-important">wastes</span> on repetitive manual work<sup className="font-normal text-3xl">*</sup>.</p>
                        </div>
                        <div className="flex justify-center">
                            <p className="mt-8 text-content-title text-h2x text-center leading-snug">Automate all data-driven processes. Build dashboards, apps,<br/>and RPA processes <span className="text-accent-important">in minutes instead of weeks</span>. No coding required.</p>
                        </div>

                        <div className="mt-16 flex justify-center">
                            <img className="" style={{width: '55rem'}} src="/img/infographics/data-automation.svg"/>
                        </div>



                        <div className="mt-48">
                            {/* <div className="flex justify-center">
                                <p className="text-content-title text-h1 font-semibold text-center">
                                    Allow <span className="text-accent-important">Data Analysts deliver tasks</span><br/>
                                    so far <span className="text-accent-important">reserved for Data Scientists</span> only.
                                </p>
                            </div> */}

                            <div className="flex justify-center">
                                <p className="text-content-title text-h1 font-semibold text-center">
                                    Let your <span className="text-accent-important">whole team deliver tasks</span><br/>
                                    so far <span className="text-accent-important">reserved for Data Scientists</span> only.
                                </p>
                            </div>
                            
                            {/* <div className="flex justify-center">
                                <p className="mt-8 text-content-subtitle text-h2x text-center leading-snug">
                                    Enso is like a virtual Data Scientist that helps every team member<br/>to create high-performance and robust data workflows.
                                </p>
                            </div> */}

                            <div className="flex justify-center mt-4">
                                <div className="grid grid-cols-2 gap-8"> 
                                    <div className="flex flex-col mt-8">
                                    <div className="grid grid-cols-2 gap-0"> 
                                        <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                            <div className="icon"><LabIcon/></div>
                                            {/* <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                                Graphs. Natural way to think of workflows.
                                            </div> */}
                                            <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                                Graphs.<br/>Explainable analytics.
                                            </div>
                                            <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                                {/* Data Analysts, Data Scientists, and Business Owners can speak the same language. */}
                                                Let business owners, data analysts, data scientists, and developers to co-design and co-create wrokflows.
                                            </div>
                                            <div className="mt-2 text-sm text-accent-important font-semibold">
                                                Learn more → 
                                            </div>
                                        </div>
                                        <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                            <div className="icon"><WorkflowIcon/></div>
                                            <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                                Enso analyses the data and suggests next steps.
                                            </div>
                                            <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                                It also predicts your intentions and displays docs with examples highly tailored for your use case. 
                                            </div>
                                            <div className="mt-2 text-sm text-accent-important font-semibold">
                                                Learn more → 
                                            </div>
                                        </div>
                                        <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                            <div className="icon"><PerformanceIcon/></div>
                                            <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                                Test ideas.<br/>Get results. Live.
                                            </div>
                                            <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                                High-performance in-memory, SQL, and Spark analytics. Move sliders, observe results. Live.
                                            </div>
                                            <div className="mt-2 text-sm text-accent-important font-semibold">
                                                Learn more → 
                                            </div>
                                        </div>
                                        <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                            <div className="icon"><ReproResultsIcon/></div>
                                            <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                                Reproducible, trustworthy results.
                                            </div>
                                            <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                                {/* Unlike in notebooks, data in Enso is not mutable, so there is no risk of accidental manual errors. Visual debugging allows you to literally see where errors come from. */}
                                                Immutable memory, versioning, and visual data quality management, allow you to trust the results.
                                            </div>
                                            <div className="mt-2 text-sm text-accent-important font-semibold">
                                                Learn more → 
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div>
                                        <img className="flex-shrink-0 max-w-none mt-12 " style={{height: '36rem'}} src="/img/infographics/collaboration2.svg"/>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="flex justify-center">
                                <button className="mt-12 button2">
                                    <p>Watch demo</p>
                                </button>
                            </div> */}
                        </div>

                        
                        

                        <div className="flex justify-center mt-56">
                            <p className="text-content-title text-h1 font-semibold text-center">
                                <span className="text-accent-important">Give your Data Scientists</span><br/>
                                and Developers <span className="text-accent-important">super-powers</span> too.
                            </p>
                        </div>

                        <div className="mt-12">
                            <div className="grid grid-cols-2 gap-7">
                                <div className="grid grid-cols-2 gap-0">
                                    <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                        <img className="" src="/img/icon-workflow.svg"/>
                                        <div className="mt-4 self-center text-xl text-content-title font-semibold">
                                            Switch from graphs to code. And back!
                                        </div>
                                        <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                            Enso is a real programming lang with a double syntax representation.
                                        </div>
                                        <div className="mt-2 text-sm text-accent-important font-semibold">
                                            Learn more → 
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                        <img className="" src="/img/icon-performance.svg"/>
                                        <div className="mt-4 self-center text-xl text-content-title font-semibold">
                                            Mix languages.<br/>Zero interop overhead.
                                        </div>
                                        <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                            Enso JiT compiles them to the same instruction set. No wrappers needed. 
                                        </div>
                                        <div className="mt-2 text-sm text-accent-important font-semibold">
                                            Learn more → 
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                        <img className="" src="/img/icon-performance.svg"/>
                                        <div className="mt-4 self-center text-xl text-content-title font-semibold">
                                            Up to 100x<br/>faster than Python.
                                        </div>
                                        <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                           Enso JiT compiler allows you to even run R up to 36x faster than GNU-R<sup>2</sup>.
                                        </div>
                                        <div className="mt-2 text-sm text-accent-important font-semibold">
                                            Learn more → 
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                        <img className="" src="/img/icon-lab.svg"/>
                                        <div className="mt-4 self-center text-xl text-content-title font-semibold">
                                            Safe.<br/>Purely Functional.
                                        </div>
                                        <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                            Immutable memory, dataflow errors, algebraic data types, simple syntax.
                                        </div>
                                        <div className="mt-2 text-sm text-accent-important font-semibold">
                                            Learn more → 
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="self-center mt-8 flex-shrink-0">
                                    {/* <img id="language-layers" src="/img/infographics/enso-language-layers.svg"/> */}
                                    <LanguageLayers/>
                                    <div className="flex justify-center mt-16">
                                        <div>
                                            <p className="text-content-normal">Supported languages</p>
                                            <div className="flex mt-4">
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/enso.svg"/>
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/java.svg"/>
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/python.svg"/>
                                                <img className="h-8 self-center mr-16" src="/img/logo/lang/javascript.svg"/>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-content-normal">Coming soon</p>
                                            <div className="flex mt-4">
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/ruby-grayed-out.svg"/>
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/r-grayed-out.svg"/>
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/c-grayed-out.svg"/>
                                                <img className="h-8 self-center mr-4" src="/img/logo/lang/rust-grayed-out.svg"/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                                
                            </div>
                            {/* <div className="flex justify-center">
                                <button className="mt-16 button2">
                                    <p>Learn more</p>
                                </button>
                            </div> */}
                        </div>





{/* Show results in understandable way
Tell impactful stories.

Developers, execs, and global team members from multiple departments can compare, filter and organize the exact data they need on the fly, in one report.

Enso makes reporting a breeze */}
{/* Tableau enables data to be treated as a strategic asset and people are committed to understand its value. */}
{/* Lead with confidence
Create data culture
Unleash your data 
Empower your people 
Discover how you can lead with data */}

                        

                        <div className="-mt-24">
                            <div className="" style={{height:"500px"}}>
                                <SubSection>
                                    <div className="relative" style={{height:"500px"}}>
                                        <div className="absolute h-full" style={{marginLeft:'-800px', zIndex:'-10'}}>
                                            <DiagonalSplitWhiteDark className="absolute h-full"/>
                                        </div>
                                    </div>
                                </SubSection>
                            </div>

                            <SubSection>
                                <div className="relative" style={{height:"1424px"}}>
                                    <div className="absolute h-full" style={{marginLeft:'-800px', zIndex:'-10'}}>
                                        <div className="absolute w-screen bg-accent-important h-full" style={{marginLeft: '-100vw', left:'0px', zIndex:'-10'}}></div> 
                                        <div className="absolute w-screen bg-accent-very-dark h-full" style={{left:'0px', zIndex:'-20'}}></div> 
                                        <DiagonalSplit className="absolute h-full"/>
                                        <DiagonalLines className="absolute h-96" style={{left: '1300px', top:'670px'}}/>
                                    </div>
                                </div>
                            </SubSection>

                            <div className="flex justify-center -mt-12">
                                <p className="text-content-title-on-dark text-h1 font-semibold text-center">
                                    {/* Unlock <span className="text-accent-important">collaboration</span>.<br/> */}
                                    {/* Understand the results like never before. <span className="text-accent-important"><br/>
                                    Design workflows. Together</span>. */}
                                    {/* Allow <span className="text-accent-important">everyone</span> to design workflows and understand the results. */}
                                    Stop waiting for reports.<br/>
                                    <span className="text-accent-important-on-dark">Ask</span> questions. <span className="text-accent-important-on-dark">Get</span> insights. <span className="text-accent-important-on-dark">Live</span>.
                                </p>
                            </div>

                            <div className="mt-16">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="rounded-3xl overflow-hidden" style={{width: '100%', height: '28px'}}>
                                            <img className="flex-shrink-0 max-w-none" style={{marginLeft:'', width: '862px'}} src="/img/infographics/dash-header.png"/>
                                        </div>
                                        <div className="mt-2 rounded-3xl overflow-hidden" style={{width: '100%', height: '360px'}}>
                                            <img className="flex-shrink-0 max-w-none" style={{marginLeft:'-20px', width: '862px'}} src="/img/infographics/dash-content.png"/>
                                        </div>
                                        <div className="ml-32 -mt-12 rounded-xl overflow-hidden" style={{width: '496px', height: '120px'}}>
                                            <img className="flex-shrink-0 max-w-none" style={{marginLeft:'0px', width: '500px'}} src="/img/infographics/dash-details.png"/>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-0 mt-8"> 
                                    {/* cards-shadow */}
                                        <div className="flex-1 rounded-3xl p-8 cursor-pointer">
                                            <div className="icon-dark"><WorkflowIcon/></div>
                                            <div className="mt-4 self-center text-xl text-content-subtitle-on-dark font-semibold">
                                                Self-Service<br/>analytics at scale.
                                            </div>
                                            <div className="mt-2 text-sm text-content-normal-on-dark font-normal text-justify">
                                                Rapid creation and deployment of standalone web-apps that are easy to use in operations.
                                            </div>
                                            <div className="mt-2 text-sm text-accent-important-on-dark font-semibold">
                                                Learn more → 
                                            </div>
                                        </div>
                                        <div className="flex-1 rounded-3xl p-8 cursor-pointer">
                                            <div className="icon-dark"><LabIcon/></div>
                                            <div className="mt-4 self-center text-xl text-content-subtitle-on-dark font-semibold">
                                                {/* Understand complex<br/>processes. Easily. */}
                                                8 minutes in matplotlib.<br/>
                                                1 second in Enso.
                                            </div>
                                            <div className="mt-2 text-sm text-content-normal-on-dark font-normal text-justify">
                                                Enso leverages custom GPU-based rasterization engine to display huge data sets live. 
                                            </div>
                                            <div className="mt-2 text-sm text-accent-important-on-dark font-semibold">
                                                Learn more → 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div className="mt-48">
                            
                            {/* <div className="absolute bg-accent-important w-screen left-1/2" style={{height:'628px', marginLeft: '-50vw', zIndex: '-100'}}></div> */}
                        
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-content-title-on-dark text-h2x leading-snug">
                                    <p className="mt-24 text-3xl font-semibold">
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                    </p>
                                    <p className="mt-12 text-xl">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                                    </p>
                                    <p className="mt-12 text-xl font-bold">
                                        Satya Nadella - CEO Microsoft
                                    </p>
                                </div>
                                <div className="ml-32 -mt-12 rounded-xl overflow-hidde">
                                    <img className="" src="/img/people/satya_nadella.png"/>
                                </div>

                            </div>
                        </div>
                    </Container>
                    
                    <div className="mt-0">
                        <div className="absolute w-full mt-2 overflow-hidden">
                            <div className="flex justify-center">
                                <MarketplaceBackground rootProps={props} className="opacity-70"/>
                            </div>
                            {/* <div className="flex justify-center">
                                <DottedBackground rootProps={props}/>
                            </div> */}
                        </div>

                        <Container>

                        <div className="flex justify-center pt-36">
                            <p className="text-content-title text-h1 font-semibold text-center">
                                Use <span className="text-accent-important">thousands of components</span>.<br/>
                                Build by us and our <span className="text-accent-important">community of experts</span>.
                            </p>
                        </div>

                        
                        <div className="grid grid-cols-4 gap-0 mt-40"> 
                            <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                <div className="icon"><WorkflowIcon/></div>
                                <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                    Data Processing
                                </div>
                                <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                    Enso analyzes the data flow, predicts the intentions, suggests next steps, and displays docs with examples highly tailored for your use case. 
                                </div>
                                <div className="mt-2 text-sm text-accent-important font-semibold">
                                    Learn more → 
                                </div>
                            </div>
                            <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                <div className="icon"><LabIcon/></div>
                                <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                    Data Visualizations
                                </div>
                                <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                    Graphs are the most natural way to express dependencies. Enso allows Data Analysts, Data Scientists, and Business Owners collaborate freely and test ideas live.
                                </div>
                                <div className="mt-2 text-sm text-accent-important font-semibold">
                                    Learn more → 
                                </div>
                            </div>
                            <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                <div className="icon"><ReproResultsIcon/></div>
                                <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                    Low-Level Libraries
                                </div>
                                <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                    Unlike in notebooks, data in Enso is not mutable, so there is no risk of accidental manual errors. Visual debugging allows you to literally see where errors come from.
                                </div>
                                <div className="mt-2 text-sm text-accent-important font-semibold">
                                    Learn more → 
                                </div>
                            </div>
                            <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer">
                                <div className="icon"><PerformanceIcon/></div>
                                <div className="mt-4 self-center text-xl text-content-subtitle font-semibold">
                                    Even ... DNA Sequencing
                                </div>
                                <div className="mt-2 text-sm text-content-normal font-normal text-justify">
                                    Enso allows for efficient SQL and in-memory Analytics. Move sliders, play with values, and observe how it affects results. Live. Also, Enso is up to 200x faster than Python<sup>2</sup>.
                                </div>
                                <div className="mt-2 text-sm text-accent-important font-semibold">
                                    Learn more → 
                                </div>
                            </div>
                        </div>

                        </Container>

{/* 
                        <div className="h-96"></div>
                        <div className="h-96"></div>
                        <div className="h-96"></div> */}
                    </div>
                    
                    <Container>
                        {/* <div className="mt-48">
                            <div className="flex justify-center">
                                <p className="text-h1 text-content-title font-bold">Get Enso</p>
                            </div>
                            <div className="flex justify-center">
                            
                                <div className="mt-16 grid grid-cols-3 gap-4 cards-shadow">
                                    <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                                        <div className="icon-with-stroke"><DesktopIcon/></div>
                                        <div className="mt-8 self-center text-2xl text-content-title font-semibold">
                                            Enso Desktop
                                        </div>
                                        <div className="mt-4 text-sm text-content-normal font-normal text-justify">
                                            Essential data processing tools. Free of charge. Available for macOS, Windows, and Linux. Hackable and fully Open Source.
                                        </div>
                                        <div className="mt-4 text-sm text-accent-important font-semibold">
                                            Download Enso Desktop →  
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl p-8 bg-white cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                                        <div className="icon"><CloudIcon/></div>
                                        <div className="mt-8 self-center text-2xl text-content-title font-semibold">
                                            Enso Cloud
                                        </div>
                                        <div className="mt-4 text-sm text-content-normal font-normal text-justify">
                                            Essential data processing tools with a fast access to all of your data in the cloud. Automatic scalability. Flexible, usage-based pricing.
                                        </div>
                                        <div className="mt-4 text-sm text-accent-important font-semibold">
                                            Try Enso Cloud → 
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl p-8 bg-accent-dark cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-no-repeat bg-right-top" style={{backgroundImage: "url(/img/bg/card-dark.svg)"}}>
                                        <div className="icon-dark"><CommunityIcon/></div>
                                        <div className="mt-8 self-center text-2xl text-content-title-on-dark font-semibold">
                                            Enso Component Store
                                        </div>
                                        <div className="mt-4 text-sm text-content-normal-on-dark font-normal text-justify">
                                            Advanced data processing libraries for geospatial analytics, statistics, graphics processing, and more. Built by the Enso team and the Enso Community.
                                        </div>
                                        <div className="mt-4 text-sm text-accent-important-on-dark font-semibold">
                                            Browse Enso Components → 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}








                        <div className="mt-48">
                            <div className="flex justify-center pt-12">
                                <p className="text-h1 text-content-title font-bold">Insights</p>
                            </div>

                            <div className="flex justify-center">
                                <div className="mt-16 grid grid-cols-3 gap-12">
                                    <div className="flex-1 rounded-3xl bg-white cursor-pointer">
                                        <img className="rounded-3xl" src="/img/insights/entry-tutorial.png"/>
                                        <div className="mt-6 self-center text-xl text-content-title font-semibold">
                                            First steps in Enso.
                                        </div>
                                        <div className="mt-4 text-sm text-content-normal font-normal text-justify">
                                            In this tutorial you will learn all the basics, including how to create and connect nodes, search for utilities, create custom reusable components, and more!
                                        </div>
                                        <div className="mt-4 text-sm text-accent-important font-semibold">
                                            Watch the tutorial → 
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl bg-white cursor-pointer">
                                        <img className="rounded-3xl" src="/img/insights/custom-visualizations.png"/>
                                        <div className="mt-6 self-center text-xl text-content-title font-semibold">
                                            Building custom data visualizations.
                                        </div>
                                        <div className="mt-4 text-sm text-content-normal font-normal text-justify">
                                            In this video podcast you will learn how to build from scratch a new 2D graphics processing library in Enso and how to connect it to Paper.js in order to display the shapes interactively on the screen.
                                        </div>
                                        <div className="mt-4 text-sm text-accent-important font-semibold">
                                            Watch the podcast → 
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-3xl bg-white cursor-pointer">
                                        <img className="rounded-3xl" src="/img/insights/compiler-internals.png"/>
                                        <div className="mt-6 self-center text-xl text-content-title font-semibold">
                                            How Enso JiT compiler can be so fast?
                                        </div>
                                        <div className="mt-4 text-sm text-content-normal font-normal text-justify">
                                            Enso Language is equipped with a state of the art, high performance, polyglot Just in Time compiler. In this video podcast you will learn about how it was designed and how it works under the hood.
                                        </div>
                                        <div className="mt-4 text-sm text-accent-important font-semibold">
                                            Watch the podcast → 
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button className="mt-12 button2-narrow">
                                    <p>Enso Tutorials</p>
                                </button>
                                <button className="mt-12 ml-8 button2-subtle-narrow">
                                    <p>Video Podcasts</p>
                                </button>
                                <button className="mt-12 ml-8 button2-subtle-narrow">
                                    <p>Development Blog</p>
                                </button>
                            </div>
                            
                        </div>




                        



                        <div className="flex mt-48 -mb-12">
                            <div className="absolute ml-80">
                                <div className="h-64 w-screen bg-accent-very-light rounded-full" style={{marginLeft:'-100vw', zIndex: '-100'}}></div>
                            </div>
                            <div className="flex mt-12">
                                <div className="w-64 cards-shadow bg-white rounded-3xl flex-shrink-0">
                                    <div className="p-6">
                                        <div className="text-xl text-content-title font-semibold">
                                            Get latest updates on your email.
                                        </div>
                                        <input className="mt-6 pt-2 pb-2 pl-4 pr-4 text-content-normal bg-accent-very-light rounded-full" type="email" id="email" size="20"></input>
                                        <button className="mt-6 button2-narrow">
                                            <p>Subscribe</p>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div className="ml-36">
                                        <div className="flex">
                                            <p className="text-h1 text-content-title font-bold">Enso Community</p>
                                        </div>
                                        <div className="">
                                            <p className="mt-8 text-content-title text-justify text-h2x leading-snug">
                                                Enso is a community-driven open source project which is and will always be open and free to use. Join us, help us develop it, and spread the word!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Container>
                        
                        

                        <div className="flex sticky bottom-4">
                            <Container>
                                <div className="flex flex-row-reverse">
                                    <div className="flex -mr-1">
                                        <div className="flex flex-col">
                                            <button className="button2-narrow border-4 border-white">
                                                <div className="flex">
                                                    <p>Chat</p>
                                                    <DiscordLogo className="w-6 h-6 ml-3 self-center fill-current text-white"/>
                                                </div>
                                            </button>
                                            <div className="fill-current self-center text-sm text-accent-important font-semibold text-justify">
                                                <p>150 online</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>

                    <div style={{marginTop:'-66px', marginRight:'216px'}}>
                    <Container>
                        <button className="h-full mt-1 mr-5 button2-subtle-narrow float-right">
                            <div className="flex">
                                <p>Forum</p>
                                <GithubLogo className="w-6 h-6 ml-3 self-center fill-current text-accent-dark"/>
                            </div>
                        </button>

                        <button className="h-full mt-1 mr-6 button2-subtle-narrow float-right">
                            <div className="flex">
                                <p>Source Code</p>
                                <GithubLogo className="w-6 h-6 ml-3 self-center fill-current text-accent-dark"/>
                            </div>
                        </button>
                    </Container>
                    </div>

                    <Container>
    
                        <SubSection>
                        <div className="flex relative h-64 mt-48">
                            <div className="absolute" style={{marginLeft:'50%', zIndex:'-100'}}>
                                <div className="absolute h-64 w-screen bg-accent-important" style={{marginLeft: '-100vw', left:'0px', zIndex:'-100'}}></div> 
                                <div className="absolute h-64 w-screen bg-accent-very-dark l-1/2" style={{marginLeft: '-50vw', left:'0px', zIndex:'-110'}}></div> 
                                <DiagonalSplit className="absolute h-64"/>
                                <div className="absolute overflow-hidden">
                                    <DiagonalLines className="absolute h-96 -mt-16" style={{left: '50px'}}/>
                                    <div className="h-64 w-screen"></div>
                                </div>
                            </div>

                            <div className="flex self-center">
                                <p className="self-center mr-96 text-h1 text-content-title-on-dark font-bold">
                                    See how Enso can work for your use case.
                                </p>
                                <button className="self-center flex-shrink-0 ml-8 button2-subtle h-full">
                                    <p>Tell us about your use case !</p>
                                </button>
                            </div>

                        </div></SubSection>
                        

                        <div className="h-96"></div>
                        <div className="h-96"></div>

                </Container>

                
            </div>

            
        </div>
        
    )
}
