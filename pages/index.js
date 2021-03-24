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

function TextContainer({ children, className, ...rest }){
    const ref = React.createRef()
    className = (className ? className : "")+" mb-5"
    
    return (
        <div className={className} ref={ref} {...rest}>
            <div className={""}>
                {children}
            </div>
        </div>
    )
}


class Container extends React.Component {
    render() {
        return (
            <div className="mx-auto w-full xlm:container" style={{maxWidth:"1200px"}}>
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
                <br/>
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
            <div className="">
                <Container>
                    <SubSection>
                        <div className="text-3xl md:text-3xl font-extrabold text-accent-dark leading-3 md:leading-tight">
                            <span className="opacity-30 text-accent-important text-2xl">ADDED in 2.0</span><br/>
                            <span className="text-accent-important display-flow">Option <span className="opacity-60">a</span></span><br/>
                        </div>
                    </SubSection>

                    <SubSection>
                        <TextContainer>
                            <span className="opacity-30 text-accent-important text-2xl">Optional values</span><br/>
                        </TextContainer>

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

                        <TextContainer>
                            Info<br/>
                            Options are commonly paired with pattern matching to query the presence of a value and take action, always accounting for the None case.<br/>
                        </TextContainer>

                        <TextContainer>
                            Example<br/>
                            Creates a new test group, desribing properties of the object described by this.<br/>
                            <code>Suite.run |</code><br/>
                            <code>   describe "Number" |</code><br/>
                            <code>       it "should define addition" |</code><br/>
                            <code>           2+3 . should_equal 5</code><br/>
                            <code>       it "should define multiplication" |</code><br/>
                            <code>            2*3 . should_equal 6</code><br/>
                        </TextContainer>
                    </SubSection>

                    <SubSection>
                        <span className="opacity-30 text-accent-important text-2xl">Constructors</span><br/>
                        <SubSection>
                        ADDED in 2.0<br/>
                        Some a<br/>
                        The Some type indicates a presence of a value.<br/>
                        </SubSection>

                        <SubSection>
                        ADDED in 2.0<br/>
                        PRIVATE<br/>
                        None<br/>
                        The None type indicates a lack of a value.<br/>
                        It is a very common type and is used by such types as Maybe or List. <br/>
                        Also, None is the return value of functions which do not return an explicit value.<br/>
                        </SubSection>
                    </SubSection>

                    <SubSection>
                        <span className="opacity-30 text-accent-important text-2xl">Methods</span><br/>
                        <SubSection>
                        pow x y<br/>
                        The pow function calculates power of integers.<br/>
                        Important<br/>
                        Foo bar baz here's my doc body.<br/>
                        </SubSection>
                    </SubSection>
                </Container>
            </div>
        </div>
    )
}
