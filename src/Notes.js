// Notes.js
import React from 'react';
import '@syncfusion/ej2-base/styles/material.css'; // Syncfusion base styles
import '@syncfusion/ej2-buttons/styles/material.css'; // Syncfusion button styles
import '@syncfusion/ej2-react-richtexteditor/styles/material.css'; // Syncfusion RTE styles
import { RichTextEditorComponent, Toolbar, Link, Table, QuickToolbar, Image, HtmlEditor, Inject } from '@syncfusion/ej2-react-richtexteditor'; // Correct importsimport './Notes.css'; // Custom styles for toolbar alignment
import './Notes.css';

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.rteObject = null; // Reference to the RichTextEditor component
    this.state = {
      noteText: this.props.noteText || '' // Initialize noteText with passed prop
    };
  }


  // Custom toolbar settings including FontColor and BackgroundColor
  customToolbarSettings = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', 'FontName', 'FontSize', 
      // 'FontColor', 'BackgroundColor', // Include FontColor and BackgroundColor in toolbar
      'LowerCase', 'UpperCase', '|', 'Formats', 'Alignments', 'OrderedList', 
      'UnorderedList', 'Outdent', 'Indent', '|', 'CreateLink', 'Image', '|', 
      'ClearFormat', 'Print', 'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
    ],
  };

  // Custom font family settings
  fontFamily = {
    items: [
      { text: 'Segoe UI', value: 'Segoe UI' },
      { text: 'Arial', value: 'Arial,Helvetica,sans-serif' },
      { text: 'Courier New', value: 'Courier New,Courier,monospace' },
      { text: 'Georgia', value: 'Georgia,serif' },
      { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
      { text: 'Calibri Light', value: 'CalibriLight' }
    ],
    width: '60px',
    default: 'Segoe UI'
  };

  // Custom font size settings
  fontSize = {
    items: [
      { text: '8', value: '8pt' },
      { text: '10', value: '10pt' },
      { text: '12', value: '12pt' },
      { text: '14', value: '14pt' },
      { text: '42', value: '42pt' }
    ],
    width: '40px',
    default: '10pt',
  };

  
  getEditorContent = () => {
    if (this.rteObject) {
      const content = this.rteObject.getText(); // Fetch plain text content
      console.log('Fetched Notes Content:', content); // Debugging log
      return content;
    }
    return '';
  };

render() {
  return (
    <div className="notes-container">        
      <RichTextEditorComponent
        ref={(richtexteditor) => { this.rteObject = richtexteditor; }} // Set reference for the editor
        value={this.state.noteText} // Set initial value from the state
        toolbarSettings={this.customToolbarSettings} // Apply the toolbar settings
        fontFamily={this.fontFamily} // Apply custom font family settings
        fontSize={this.fontSize} // Apply custom font size settings
        height="800px" // Adjust height to ensure the editor is visible
      >
        {/* Inject necessary services */}
        <Inject services={[Toolbar, Link, Image, HtmlEditor, Table, QuickToolbar]} /> 
      </RichTextEditorComponent>
    </div>
  );
}
}

export default Notes;
