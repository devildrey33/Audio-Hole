import options from "../Config/Options.jsx";

export default function UI_Github() {

    return <a href={ options.urlGitHub } target='_blank' className='Experience_Panel Experience_Control' title='GitHub project'>
        <img draggable='false' src='icos.svg#svg-github' />
    </a>
}