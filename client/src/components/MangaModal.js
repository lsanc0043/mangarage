import Modal from "react-bootstrap/Modal";
import QuizCard from "./QuizCard";

const MangaModal = ({
  showModal,
  setShowModal,
  selectedManga,
  readMangas,
  markReadOrUnread,
  complete,
  getComplete,
  ratings,
  userRating,
  sendRating,
}) => {
  const renderInfo = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              position: "fixed",
              width: "100px",
              textAlign: "center",
              display: !readMangas.includes(selectedManga.id)
                ? "block"
                : "none",
            }}
          >
            You can now scratch this manga off on the poster!
          </p>
          <img
            className="modal-cover"
            src={
              complete === selectedManga.id &&
              !readMangas.includes(selectedManga.id)
                ? "https://i.ibb.co/H49kqG7/silver.png"
                : selectedManga.cover
            }
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
      </>
    );
  };

  if (selectedManga === {}) {
    return "Loading...";
  } else {
    return (
      // manga modal
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            <h2
              style={{
                display:
                  readMangas.includes(selectedManga.id) ||
                  complete === selectedManga.id
                    ? "block"
                    : "none",
              }}
            >
              {`${selectedManga.title} (${selectedManga.year})`}
            </h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="manga-modal">
            {readMangas.includes(selectedManga.id) ||
            complete === selectedManga.id ? (
              renderInfo()
            ) : (
              <QuizCard
                selectedManga={selectedManga}
                completeQuiz={getComplete}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <form
            style={{
              display:
                readMangas.includes(selectedManga.id) ||
                complete === selectedManga.id
                  ? "block"
                  : "none",
            }}
          >
            <span style={{ fontSize: "18px" }}>
              <strong>Rating: </strong>
              {readMangas.includes(selectedManga.id) ? (
                <u>{ratings[readMangas.indexOf(selectedManga.id)]}</u>
              ) : (
                <input
                  type="number"
                  max="10"
                  style={{ width: "30px" }}
                  placeholder="0"
                  value={userRating}
                  onChange={(e) => sendRating(e.target.value)}
                />
              )}
              <strong>/10</strong>
            </span>
          </form>
          {/* mark as read or unread */}
          <button
            className="modal-button"
            style={{
              display: readMangas.includes(selectedManga.id) ? "block" : "none",
            }}
            onClick={() => {
              setShowModal(false);
              markReadOrUnread(
                selectedManga.id,
                !readMangas.includes(selectedManga.id)
              );
            }}
          >
            <strong>
              {readMangas.includes(selectedManga.id)
                ? "Mark as Unread"
                : "Mark as Read"}
            </strong>
          </button>
          {/* return to the poster */}
          <button
            className="modal-button"
            onClick={() => {
              setShowModal(false);
              // markReadOrUnread(
              //   selectedManga.id,
              //   !readMangas.includes(selectedManga.id)
              // );
            }}
          >
            <strong>Go Back to Poster</strong>
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default MangaModal;
