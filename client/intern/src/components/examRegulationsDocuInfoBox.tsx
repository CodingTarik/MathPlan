import React, { useState } from 'react';

interface InfoBoxProps {
  info: string;
  name: string;
  description: string;
  minCreditPointsOverall: string;
  maxCreditPointsOverall: string;
  minCreditPointsPraktikum: string;
  maxCreditPointsPraktikum: string;
  minCreditPointsSeminar: string;
  maxCreditPointsSeminar: string;
  minCreditPointsVorlesung: string;
  maxCreditPointsVorlesung: string;
  minExamPlanCheck: string;
  maxExamPlanCheck: string;
  minSeminarsCP: string;
  maxSeminarsCP: string;
  minPraktikumCount: string;
  maxPraktikumCount: string;
  minVorlesungCount: string;
  maxVorlesungCount: string;
  minModuleCount: string;
examPlanArea: string;
modules: string;
moduleRange: string;
}
/**
 * InfoBox component displays information in a collapsible box.
 * @param {InfoBoxProps} props - Props for the InfoBox component.
 * @returns {JSX.Element} - InfoBox component.
 */
const InfoBox: React.FC<InfoBoxProps> = ({
  info,
  name,
  description,
  minCreditPointsOverall,
  maxCreditPointsOverall,
  minCreditPointsPraktikum,
  maxCreditPointsPraktikum,
  minCreditPointsSeminar,
  maxCreditPointsSeminar,
  minCreditPointsVorlesung,
  maxCreditPointsVorlesung,
  minExamPlanCheck,
  maxExamPlanCheck,
  minSeminarsCP,
  maxSeminarsCP,
  minPraktikumCount,
  maxPraktikumCount,
  minVorlesungCount,
  maxVorlesungCount,
  minModuleCount
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded p-4 mb-4">
      <button
        className="btn btn-primary mb-3"
        type="button"
        onClick={toggleCollapse}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="infoBoxCollapse"
      >
        {isOpen ? 'Hide Info' : 'Show Info'}
      </button>
      <div className={`collapse ${isOpen ? 'show' : ''}`} id="infoBoxCollapse">
        <h5>{info}</h5>
        <div className="mb-3">
          <strong>Area Name:</strong> {name}
        </div>
        <div className="mb-3">
          <strong>Description:</strong> {description}
        </div>
        <div className="mb-3">
          <strong>Minimum Overall Credit Points:</strong>{' '}
          {minCreditPointsOverall}
        </div>
        <div className="mb-3">
          <strong>Maximum Overall Credit Points:</strong>{' '}
          {maxCreditPointsOverall}
        </div>
        <div className="mb-3">
          <strong>Minimum Credit Points for Praktikum:</strong>{' '}
          {minCreditPointsPraktikum}
        </div>
        <div className="mb-3">
          <strong>Maximum Credit Points for Praktikum:</strong>{' '}
          {maxCreditPointsPraktikum}
        </div>
        <div className="mb-3">
          <strong>Minimum Credit Points for Seminar:</strong>{' '}
          {minCreditPointsSeminar}
        </div>
        <div className="mb-3">
          <strong>Maximum Credit Points for Seminar:</strong>{' '}
          {maxCreditPointsSeminar}
        </div>
        <div className="mb-3">
          <strong>Minimum Credit Points for Vorlesung:</strong>{' '}
          {minCreditPointsVorlesung}
        </div>
        <div className="mb-3">
          <strong>Maximum Credit Points for Vorlesung:</strong>{' '}
          {maxCreditPointsVorlesung}
        </div>
        <div className="mb-3">
          <strong>Minimum Sub-Area Check:</strong> {minSubAreaCheck}
        </div>
        <div className="mb-3">
          <strong>Maximum Sub-Area Check:</strong> {maxSubAreaCheck}
        </div>
        <div className="mb-3">
          <strong>Minimum Seminars Count:</strong> {minSeminarsCount}
        </div>
        <div className="mb-3">
          <strong>Minimum Seminars Credit Points:</strong> {minSeminarsCP}
        </div>
        <div className="mb-3">
          <strong>Maximum Seminars Credit Points:</strong> {maxSeminarsCP}
        </div>
        <div className="mb-3">
          <strong>Maximum Seminars Count:</strong> {maxSeminarsCount}
        </div>
        <div className="mb-3">
          <strong>Minimum Praktikum Count:</strong> {minPraktikumCount}
        </div>
        <div className="mb-3">
          <strong>Maximum Praktikum Count:</strong> {maxPraktikumCount}
        </div>
        <div className="mb-3">
          <strong>Minimum Vorlesung Count:</strong> {minVorlesungCount}
        </div>
        <div className="mb-3">
          <strong>Maximum Vorlesung Count:</strong> {maxVorlesungCount}
        </div>
        <div className="mb-3">
          <strong>Minimum Module Count:</strong> {minModuleCount}
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
