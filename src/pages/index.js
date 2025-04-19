import Welcome from "./Welcome";
import About from "./About";
import PatchNotes from "./PatchNotes";
import Calendar from "./Calendar";
import UIMatrix from "./UIMatrix";
import UrgencyAgenda from "./UrgencyAgenda";
import { CALC_HEIGHT_MINUS } from "../utils";

/**
 * @SQUARE_COLOURS (May add later if needed)
 * background: "rgba(255, 0, 0, 0.5)",
 * background: "rgba(0, 0, 255, 0.5)",
 * background: "rgba(255, 255, 0, 0.5)",
 * background: "rgba(128, 128, 128, 0.5)",
 * 
 */

const borderColor = "rgba(255, 255, 255, 0.25)"
export const uimatrix = {
  fullpage: {
    height: `calc(100vh - ${CALC_HEIGHT_MINUS}px)`,
    width: "100%",
    overflow: "hidden",
    position: "relative", // Ensure the container is positioned relative
    borderCollapse: "collapse",
    fontWeight: "bold"
  },
  square: { letterSpacing: "2px", color: "rgba(255, 255, 255, 0.25)", userSelect: "none", height: "calc(50% + 2px)", width: "calc(50% + 2px)", position: "absolute", zIndex: 0 },
  urgimp: { flex: 1, top: 0, left: 0, borderRight: `4px groove ${borderColor}`, borderBottom: `4px groove ${borderColor}` },
  nurgimp: { flex: 1, top: 0, right: 0, borderLeft: `4px groove ${borderColor}`, borderBottom: `4px groove ${borderColor}` },
  urgnimp: { flex: 1, bottom: 0, left: 0, borderRight: `4px groove ${borderColor}`, borderTop: `4px groove ${borderColor}` },
  nurgnimp: { flex: 1, bottom: 0, right: 0, borderLeft: `4px groove ${borderColor}`, borderTop: `4px groove ${borderColor}` },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 500, borderRadius: "50%" }
}


export { Welcome, About, PatchNotes, Calendar, UIMatrix, UrgencyAgenda }