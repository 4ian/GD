#if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI)
#ifndef PROJECTUPDATEDIALOG_H
#define PROJECTUPDATEDIALOG_H

//(*Headers(ProjectUpdateDialog)
#include <wx/button.h>
#include <wx/dialog.h>
#include <wx/sizer.h>
#include <wx/statline.h>
#include <wx/stattext.h>
#include <wx/textctrl.h>
//*)

class ProjectUpdateDialog : public wxDialog {
 public:
  ProjectUpdateDialog(wxWindow* parent, wxString);
  virtual ~ProjectUpdateDialog();

  //(*Declarations(ProjectUpdateDialog)
  wxStaticText* StaticText2;
  wxStaticText* StaticText1;
  wxStaticLine* StaticLine1;
  wxTextCtrl* updateTextEdit;
  wxButton* okBt;
  //*)

 protected:
  //(*Identifiers(ProjectUpdateDialog)
  static const long ID_STATICTEXT1;
  static const long ID_TEXTCTRL1;
  static const long ID_STATICTEXT2;
  static const long ID_STATICLINE1;
  static const long ID_BUTTON1;
  //*)

 private:
  //(*Handlers(ProjectUpdateDialog)
  void OnokBtClick(wxCommandEvent& event);
  //*)

  DECLARE_EVENT_TABLE()
};

#endif
#endif
