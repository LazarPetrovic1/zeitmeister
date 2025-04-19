import { useContext, useState } from "react";
import { EventContext } from "../contexts/EventContext";
import { List, UrgencyReportModal } from "../components";
import { getPriority } from "../utils";

function UrgencyAgenda() {
  const [isGenerated, setIsGenerated] = useState(() => false);
  const { lsUrgencyRequests } = useContext(EventContext);
  const { urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant, undetermined } = lsUrgencyRequests
  const vals1 = getPriority(0);
  const vals2 = getPriority(1);
  const vals3 = getPriority(2);
  const vals4 = getPriority(3);
  const none = getPriority(4);
  return (
    <>
      <section className="pb-4">
        {urgentImportant && (
          <div className="my-3">
            <h4 style={{ color: vals1.color }}>{vals1.txt}</h4>
            <List level={0} items={urgentImportant} />
          </div>
        )}
        {notUrgentImportant && (
          <div className="my-3">
            <h4 style={{ color: vals2.color }}>{vals2.txt}</h4>
            <List level={1} items={notUrgentImportant} />
          </div>
        )}
        {urgentNotImportant && (
          <div className="my-3">
            <h4 style={{ color: vals3.color }}>{vals3.txt}</h4>
            <List level={2} items={urgentNotImportant} />
          </div>
        )}
        {notUrgentNotImportant && (
          <div className="my-3">
            <h4 style={{ color: vals4.color }}>{vals4.txt}</h4>
            <List level={3} items={notUrgentNotImportant} />
          </div>
        )}
        {undetermined && (
          <div className="my-3">
            <h4 style={{ color: none.color }}>{none.txt}</h4>
            <List level={4} items={undetermined} />
          </div>
        )}
        <button onClick={() => setIsGenerated(() => true)} className="btn btn-primary w-100 mt-3">
          <i className="fa-solid fa-file-contract pe-2" />Generate
        </button>
      </section>
      <UrgencyReportModal
        show={isGenerated}
        onClose={() => setIsGenerated(() => false)}
        onSave={() => setIsGenerated(() => false)}
        title="Advice for dealing with upcoming events"
      />
    </>
  )
}

export default UrgencyAgenda