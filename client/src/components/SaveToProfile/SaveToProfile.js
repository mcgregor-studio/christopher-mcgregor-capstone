import React from "react";
import save from "../../data/save.svg";
import "./SaveToProfile.scss";

export default function SaveToProfile(props) {
  let { handleSaveImage, saveTry, saveWin, saveLose, saveButton } = props;
  return (
    <div>
      <button className={saveButton} onClick={handleSaveImage}>
        <img className="paint__button--icon" src={save} alt="Save image to profile" />
      </button>
      <p className={saveTry}>Saving...</p>
      <p className={saveWin}>Saved!</p>
      <p className={saveLose}>
        No save slots available - please delete a picture
      </p>
    </div>
  );
}
