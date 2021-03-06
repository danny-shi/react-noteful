import React from "react";
import config from "./config";
const FileContext = React.createContext();
export default FileContext;

export class FileContextProvider extends React.Component {
  state = {
    folders: null,
    notes: null,
  };

  componentDidMount = () => {
    fetch(`${config.API_ENDPOINT}/folders`)
      .then((res) => {
        return res.json();
      })
      .then((folders) => {
        this.setState({
          folders: folders,
        });
      });

    fetch(`${config.API_ENDPOINT}/notes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("bad stuff yo");
        }
        return res.json();
      })
      .then((notes) => {
        this.setState({
          notes: notes,
        });
      })
      .catch((error) => {
        return error.message;
      });
  };

  addFolder = (folderName) => {
    console.log(folderName);
    let body = { folder_name: folderName };

    fetch(`${config.API_ENDPOINT}/folders/`, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("bad stuff yo");
        }
        return res.json();
      })
      .then((data) => {
        let folders = this.state.folders;
        folders.push(data);
        this.setState({
          folders: folders,
        });
      })
      .catch((error) => {
        return error.message;
      });
  };

  addNote = (noteName, folderId, content, dateModified) => {
    let body = {
      name: noteName,
      modified: dateModified,
      folderId: folderId,
      content: content,
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("bad stuff yo");
        }
        return res.json();
      })
      .then((data) => {
        let notes = this.state.notes;
        notes.push(data);
        this.setState({
          notes: notes,
        });
      })
      .catch((error) => {
        return error.message;
      });
  };

  deleteNote = (noteID) => {
    fetch(`${config.API_ENDPOINT}/notes/${noteID}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("bad stuff yo");
        }
        return res.json();
      })
      .then((data) => {
        let newNotes = this.state.notes.filter((note) => note.id !== noteID);
        this.setState({
          notes: newNotes,
        });
      })
      .catch((error) => {
        return error.message;
      });
  };

  render() {
    if (this.state.folders === null || this.state.notes === null) {
      return <div>Loading</div>;
    }
    return (
      <FileContext.Provider
        value={{
          folders: this.state.folders,
          notes: this.state.notes,
          addFolder: this.addFolder,
          addNote: this.addNote,
          deleteNote: this.deleteNote,
        }}
      >
        {this.props.children}
      </FileContext.Provider>
    );
  }
}
