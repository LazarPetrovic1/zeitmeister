import { Link } from 'react-router-dom'
const { shell } = window.require('electron');

function About() {
  const openGit = () => shell.openExternal('https://github.com/LazarPetrovic1')
  return (
    <div className="container">
      <h1 className="text-primary text-center">About</h1>
      <h3 className="text-info">If you're interested in information about the project, kindly visit the patch notes page <Link to="/patch-notes">here</Link></h3>
      <h3 className="text-info">If you're interested in information about the author, kindly visit his <span onClick={openGit} className="text-decoration-underline" role="button">GitHub repository</span></h3>
    </div>
  )
}

export default About;