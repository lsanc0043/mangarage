import Modal from "react-bootstrap/Modal";

const MangaModal = ({ showModal, setShowModal, selectedManga }) => {
  if (selectedManga === {}) {
    return "Loading...";
  } else {
    return (
      // manga modal
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            <h2>{selectedManga.title}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="manga-modal">
            <div>
              <img
                className="modal-cover"
                src={selectedManga.cover}
                alt={`${selectedManga.title} cover`}
              />
            </div>
            {/* other manga content: author, status, genres, description */}
            <div className="manga-info">
              <h5>
                <strong>Author: </strong>
                <span>{selectedManga.author}</span>
              </h5>
              <h5>
                <strong>Status: </strong>
                {selectedManga.status
                  ? selectedManga.status.slice(0, 1).toUpperCase() +
                    selectedManga.status.slice(1)
                  : ""}
              </h5>
              <h5>
                <strong>Genres: </strong>
                {selectedManga.genres
                  ? selectedManga.genres.slice(0, 5).join(", ")
                  : ""}
              </h5>
              {/* scrollable description */}
              <div className="manga-description">
                <h5>
                  <strong>Description: </strong>
                  {selectedManga.description}
                </h5>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* return to the poster */}
          <button className="modal-button" onClick={() => setShowModal(false)}>
            <strong>Go Back to Poster</strong>
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default MangaModal;