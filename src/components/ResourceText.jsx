import { getResourceColour } from "../utils"

function ResourceText({ resource }) {
  const color = getResourceColour(resource)
  return <p><i>Type of event</i>: <b style={{ color }}>{resource}</b></p>
}

export default ResourceText