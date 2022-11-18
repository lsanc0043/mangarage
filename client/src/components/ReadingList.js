import { useState } from "react";
// eslint-disable-next-line
import "react-widgets/styles.css";
import Combobox from "react-widgets/Combobox";
import DropdownList from "react-widgets/DropdownList";

const ReadingList = ({ userId }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState("");
  const searchManga = async (e) => {
    const search = e;
    const response = await fetch(`/manga/post/${search}`);
    const data = await response.json();
    console.log(data);
    setSearchResults(data);
  };

  return (
    <div className="reading-list">
      <form>
        <Combobox
          hideCaret
          hideEmptyPopup
          filter="contains"
          defaultValue=""
          data={searchResults}
          onChange={searchManga}
          onSelect={(e) => setSelection(e)}
        />
        {/* <DropdownList
          placeholder="Status"
          data={["Just Started", "Halfway", "Almost Done"]}
        /> */}
      </form>
      {selection}
    </div>
  );
};

export default ReadingList;
