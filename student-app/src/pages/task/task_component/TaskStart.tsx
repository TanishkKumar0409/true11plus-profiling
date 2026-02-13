import { ButtonGroup } from "../../../ui/buttons/Button";

interface TaskStartCTAProps {
  onStart: () => void;
  loading?: boolean;
}

const TaskStart = ({ onStart, loading = false }: TaskStartCTAProps) => {
  return (
    <div
      key="ready"
      className="relative overflow-hidden p-6 text-center bg-(--main) text-(--white) shadow-custom rounded-custom"
    >
      <div className="relative z-10">
        <h1 className="font-extrabold tracking-tight">Ready to Start?</h1>

        <p className="text-(--white)! mt-3 mb-8 leading-relaxed font-medium">
          Begin working on this task and automatically notify your mentor that
          progress has started.
        </p>
        <div className="flex justify-center">
          <ButtonGroup
            label={loading ? "Processing..." : "Start Task Now"}
            onClick={onStart}
            disable={loading}
            className="bg-(--main-emphasis)!"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskStart;
