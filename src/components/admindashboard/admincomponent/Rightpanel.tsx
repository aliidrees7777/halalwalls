import CategoriesPanel from "./CategoriesPanel";
import StorageCard from "./StorageCard";

interface Props {
  /** Opens the full "Top Categories" view. */
  onViewAll?: () => void;
}

const Rightpanel = ({ onViewAll }: Props) => {
  return (
    <div>
      <div className="rpanel">
        <CategoriesPanel variant="widget" onViewAll={onViewAll} />

        <StorageCard />

        <div className="rcard">
          <div className="rcard-ttl">System Status</div>
          <div className="sys-ok">
            <div className="sys-dot"></div>All Systems Operational
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightpanel;
