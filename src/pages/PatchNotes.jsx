const { shell } = window.require('electron');

function PatchNotes() {
  const openRepo = () => shell.openExternal('https://github.com/LazarPetrovic1/zeitmeister')
  return (
    <div className="container">
      <h1 className="text-primary text-center">Patch Notes</h1>
      <h2 className="text-secondary mb-5">
        This is a rolling release project. The only way to get the previous version is to manually install the desired version from the GitHub repository of this project, which is found&nbsp;
        <span onClick={openRepo} className="text-decoration-underline" role="button">here</span>
      </h2>
    </div>
  )
}

export default PatchNotes;