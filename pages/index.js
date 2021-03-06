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

// =======================================
// === Compile-time Content Generation ===
// =======================================

/// Called during compile-time by Next.js.
export async function getStaticProps() {
    return {
        props: {}
    }
}

/// ===============
/// === Content ===
/// ===============

function TextContainer({ children, className, tp="raw",...rest }){
    const ref = React.createRef()
    className = (className ? className : "") + " p-10"
    let tpName = tp == "raw" ? "" : tp
    if (tpName === ""){
        return (
            <div className={className + " pb-0"} ref={ref} {...rest}>
                <div className={""}>
                    {children}
                </div>
            </div>
        )
    }

    className += " mt-5 mb-10"

    let bg = "rgb(248, 248, 248)"
    if (tp === "Important"){
        bg = "rgb(252, 245, 217)"
    } else if (tp === "Info"){
        bg = "rgb(198, 251, 229)"
    } else if (tp === "Code"){
        bg = "rgb(240, 240, 240)"
    }

    return (
        <div className={className+" pt-5"} ref={ref} {...rest} style={{backgroundColor: bg, borderRadius: 14 + "px"}}>
            <span className="text-accent-important text-2xl">{tpName}</span><br/>
            <div className={"mt-5"}>
                {children}
            </div>
        </div>
    )
}

function CodeContainer({ children, className, tp="raw",...rest }){
    const ref = React.createRef()
    let bg = "rgb(240, 240, 240)"

    return (
        <div className={className+" p-10 mt-5 mb-0"} ref={ref} {...rest} style={{backgroundColor: bg, borderRadius: 14 + "px"}}>
            <div className={""}>
                {children}
            </div>
        </div>
    )
}


class Container extends React.Component {
    render() {
        return (
            <div className="mx-auto xlm:container">
                <div className="">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
  

class SubSection extends React.Component {
    render() {
        return (
            <div>
                <Container className="mb-5">
                    {this.props.children}
                </Container>
            </div>
        )
    }
}

class Documentation extends React.Component {
    render() {
        return (
            <div className="mx-20 lg:mx-auto" style={{maxWidth:"900px"}}>
                <div className="">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class InnerDocumentation extends React.Component {
    render() {
        return (
            <div className="mt-5 mb-16">
                <div className="">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

function Tag({ children, name, desc=""}){
    let bg = "rgba(240, 240, 240, 0.76)"
    if (name === "DEPRECATED"){
        bg = "rgba(252, 245, 217, 0.76)"
    } else if (name === "ADDED"){
        bg = "rgba(198, 251, 229, 0.76)"
    } else if (name === "UPCOMING"){
        bg = "rgba(226, 240, 255, 0.76)"
    } else if (name === "MODIFIED"){
        bg = "rgba(241, 226, 255, 0.76)"
    }
    return (
        <div className="m-1 p-5 px-auto py-4" style={{backgroundColor: bg, borderRadius: 14 + "px", minWidth:80+"px"}}>
            <span className="opacity-80 text-accent-important">{name} {desc}</span><br/>
        </div>
    )
}

function DocHeader({ children, name, args="", tags}){
    return (
        <SubSection>
            <div className="text-accent-dark leading-3 md:leading-tight">
                <div className="mb-3" style={{display:"flex"}}>
                    {children}
                </div>
                <span className="text-3xl text-accent-important display-flow">{name} <span className="opacity-60">{args}</span></span><br/>
            </div>
        </SubSection>
    )
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
            <div className="">
                <Documentation>
                    <DocHeader name="Option" args="a">
                        <Tag name="ADDED" desc="in 2.0"></Tag>
                    </DocHeader>

                    <SubSection>
                        <TextContainer>
                            <span className="text-2xl">Optional values</span>
                        </TextContainer>
                    </SubSection>

                    <SubSection>
                        <TextContainer>
                            Type Option represents an optional value: every Option is either Some and contains a value, or None, and does not. <br/>
                            Option types are very common in Enso code, as they have a number of uses:<br/>
                            <ul className="list-disc pl-5 mt-3 mb-3">
                                <li>Initial values.</li>
                                <li>Return values for functions that are not defined over their entire input range (partial functions).</li>
                                <li>Return value for otherwise reporting simple errors, where `None` is returned on error.</li>
                                <li>Optional struct fields.</li>
                                <li>Optional function arguments.</li>
                            </ul>
                        </TextContainer>

                        <TextContainer tp="Info">
                            Options are commonly paired with pattern matching to query the presence of a value and take action, always accounting for the None case.<br/>
                        </TextContainer>

                        <TextContainer tp="Example">
                            Creates a new test group, desribing properties of the object described by this.<br/>
                            <CodeContainer>
                                <pre>
                                <code>Suite.run |</code><br/>
                                <code>    describe "Number" |</code><br/>
                                <code>        it "should define addition" |</code><br/>
                                <code>            2+3 . should_equal 5</code><br/>
                                <code>        it "should define multiplication" |</code><br/>
                                <code>            2*3 . should_equal 6</code><br/>
                                </pre>
                            </CodeContainer>
                        </TextContainer>
                    </SubSection>

                    <SubSection>
                        <span className="font-extrabold text-accent-important text-3xl">Constructors</span><br/>
                        <InnerDocumentation>
                            <DocHeader name="Some" args="a">
                                <Tag name="UPCOMING" desc="in 2.0"></Tag>
                                <Tag name="PRIVATE"></Tag>
                            </DocHeader>

                            <SubSection>
                                <TextContainer>
                                    The Some type indicates a presence of a value.<br/>
                                </TextContainer>
                            </SubSection>
                        </InnerDocumentation>

                        <InnerDocumentation>
                            <DocHeader name="None">
                                <Tag name="ADDED" desc="in 2.0"></Tag>
                                <Tag name="DEPRECATED"></Tag>
                            </DocHeader>

                            <SubSection>
                                <TextContainer>
                                    The None type indicates a lack of a value.<br/>
                                </TextContainer>
                            </SubSection>

                            <SubSection>
                                <TextContainer>
                                    It is a very common type and is used by such types as Maybe or List. <br/>
                                    Also, None is the return value of functions which do not return an explicit value.<br/>
                                </TextContainer>
                            </SubSection>
                        </InnerDocumentation>
                    </SubSection>

                    <SubSection>
                        <span className="font-extrabold text-accent-important text-3xl">Methods</span><br/>
                        <InnerDocumentation>
                            <DocHeader name="to_Integer" args="v">
                                <Tag name="MODIFIED" desc="in 2.0"></Tag>
                            </DocHeader>

                            <SubSection>
                                <TextContainer>
                                    Casts value to <code>Integer</code>.<br/>
                                </TextContainer>
                            </SubSection>
                            
                            <SubSection>
                                <TextContainer tp="Important">
                                    Foo bar baz boooo.
                                </TextContainer>
                            </SubSection>
                        </InnerDocumentation>
                    </SubSection>
                </Documentation>
            </div>
        </div>
    )
}
