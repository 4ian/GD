/*
 * GDevelop IDE
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the GNU General Public License version 3.
 */
#include "ExternalLayoutEditor.h"

//(*InternalHeaders(ExternalLayoutEditor)
#include <wx/bitmap.h>
#include <wx/intl.h>
#include <wx/image.h>
#include <wx/string.h>
//*)
#include <wx/config.h>
#include "GDCore/Project/ExternalLayout.h"
#include "GDCore/IDE/Dialogs/LayoutEditorCanvas/LayoutEditorCanvas.h"
#include "../InitialPositionBrowserDlg.h"
#include "LayoutEditorPropertiesPnl.h"
#include "ObjectsEditor.h"
#include "LayersEditorPanel.h"
#include "ExternalEditorPanel.h"
#include "../MainFrame.h"
#include "GDCore/IDE/wxTools/SkinHelper.h"
#include "GDCore/CommonTools.h"
#include "GDCore/Tools/Localization.h"
#include "GDCore/IDE/Dialogs/ExternalEditor/ExternalEditor.h"
#include "GDCore/IDE/ProjectStripper.h"
#include "GDCore/Tools/HexToRgb.h"

using namespace gd;

//(*IdInit(ExternalLayoutEditor)
const long ExternalLayoutEditor::ID_STATICTEXT1 = wxNewId();
const long ExternalLayoutEditor::ID_COMBOBOX1 = wxNewId();
const long ExternalLayoutEditor::ID_PANEL1 = wxNewId();
const long ExternalLayoutEditor::ID_SCROLLBAR2 = wxNewId();
const long ExternalLayoutEditor::ID_SCROLLBAR1 = wxNewId();
const long ExternalLayoutEditor::ID_CUSTOM1 = wxNewId();
const long ExternalLayoutEditor::ID_PANEL5 = wxNewId();
const long ExternalLayoutEditor::ID_STATICTEXT2 = wxNewId();
const long ExternalLayoutEditor::ID_STATICBITMAP1 = wxNewId();
const long ExternalLayoutEditor::ID_PANEL3 = wxNewId();
const long ExternalLayoutEditor::ID_PANEL2 = wxNewId();
//*)

BEGIN_EVENT_TABLE(ExternalLayoutEditor,wxPanel)
	//(*EventTable(ExternalLayoutEditor)
	//*)
END_EVENT_TABLE()

ExternalLayoutEditor::ExternalLayoutEditor(wxWindow* parent, gd::Project & project_, gd::ExternalLayout & externalLayout_, const gd::MainFrameWrapper & mainFrameWrapper_) :
	layoutEditorCanvas(NULL),
	externalLayout(externalLayout_),
	project(project_),
	mainFrameWrapper(mainFrameWrapper_),
	isEditorDisplayed(true)
{
    gd::InitialInstancesContainer & instanceContainer = dynamic_cast<gd::InitialInstancesContainer&>(externalLayout.GetInitialInstances());

	//(*Initialize(ExternalLayoutEditor)
	wxFlexGridSizer* FlexGridSizer4;
	wxFlexGridSizer* FlexGridSizer3;
	wxFlexGridSizer* FlexGridSizer2;
	wxFlexGridSizer* helpSizer;
	wxFlexGridSizer* FlexGridSizer1;

	Create(parent, wxID_ANY, wxDefaultPosition, wxDefaultSize, wxTAB_TRAVERSAL, _T("wxID_ANY"));
	SetBackgroundColour(wxColour(255,255,255));
	FlexGridSizer1 = new wxFlexGridSizer(0, 1, 0, 0);
	FlexGridSizer1->AddGrowableCol(0);
	FlexGridSizer1->AddGrowableRow(0);
	corePanel = new wxPanel(this, ID_PANEL2, wxDefaultPosition, wxDefaultSize, wxTAB_TRAVERSAL, _T("ID_PANEL2"));
	corePanel->SetBackgroundColour(wxColour(255,255,255));
	FlexGridSizer4 = new wxFlexGridSizer(0, 1, 0, 0);
	FlexGridSizer4->AddGrowableCol(0);
	FlexGridSizer4->AddGrowableRow(1);
	contextPanel = new wxPanel(corePanel, ID_PANEL1, wxDefaultPosition, wxDefaultSize, wxTAB_TRAVERSAL, _T("ID_PANEL1"));
	contextPanel->SetBackgroundColour(wxColour(255,255,255));
	FlexGridSizer2 = new wxFlexGridSizer(0, 3, 0, 0);
	FlexGridSizer2->AddGrowableCol(1);
	FlexGridSizer2->AddGrowableRow(0);
	StaticText1 = new wxStaticText(contextPanel, ID_STATICTEXT1, _("Edit as if the objects were included to scene :"), wxDefaultPosition, wxDefaultSize, 0, _T("ID_STATICTEXT1"));
	FlexGridSizer2->Add(StaticText1, 1, wxALL|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 5);
	parentSceneComboBox = new wxComboBox(contextPanel, ID_COMBOBOX1, wxEmptyString, wxDefaultPosition, wxDefaultSize, 0, 0, 0, wxDefaultValidator, _T("ID_COMBOBOX1"));
	parentSceneComboBox->SetSelection( parentSceneComboBox->Append(_("No scene")) );
	FlexGridSizer2->Add(parentSceneComboBox, 1, wxALL|wxEXPAND|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 3);
	contextPanel->SetSizer(FlexGridSizer2);
	FlexGridSizer2->Fit(contextPanel);
	FlexGridSizer2->SetSizeHints(contextPanel);
	FlexGridSizer4->Add(contextPanel, 1, wxALL|wxEXPAND|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 0);
	FlexGridSizer3 = new wxFlexGridSizer(0, 1, 0, 0);
	FlexGridSizer3->AddGrowableCol(0);
	FlexGridSizer3->AddGrowableRow(0);
	FlexGridSizer3->AddGrowableRow(1);
	layoutPanel = new wxPanel(corePanel, ID_PANEL5, wxDefaultPosition, wxDefaultSize, wxNO_BORDER|wxTAB_TRAVERSAL, _T("ID_PANEL5"));
	layoutPanel->SetBackgroundColour(wxColour(255,255,255));
	scrollBar2 = new wxScrollBar(layoutPanel, ID_SCROLLBAR2, wxDefaultPosition, wxDefaultSize, wxSB_VERTICAL, wxDefaultValidator, _T("ID_SCROLLBAR2"));
	scrollBar2->SetScrollbar(2500, 10, 5000, 10);
	scrollBar1 = new wxScrollBar(layoutPanel, ID_SCROLLBAR1, wxDefaultPosition, wxDefaultSize, wxSB_HORIZONTAL, wxDefaultValidator, _T("ID_SCROLLBAR1"));
	scrollBar1->SetScrollbar(2500, 10, 5000, 10);
	layoutEditorCanvas = new gd::LayoutEditorCanvas(layoutPanel, project, emptyLayout, instanceContainer, externalLayout.GetAssociatedSettings(), mainFrameWrapper);
	FlexGridSizer3->Add(layoutPanel, 1, wxALL|wxEXPAND|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 0);
	helpPanel = new wxPanel(corePanel, ID_PANEL3, wxDefaultPosition, wxDefaultSize, wxTAB_TRAVERSAL, _T("ID_PANEL3"));
	helpPanel->SetBackgroundColour(wxColour(255,255,255));
	helpSizer = new wxFlexGridSizer(0, 3, 0, 0);
	helpSizer->AddGrowableRow(0);
	StaticText2 = new wxStaticText(helpPanel, ID_STATICTEXT2, _("Choose the scene to be used as a base for editing the external layout"), wxDefaultPosition, wxDefaultSize, 0, _T("ID_STATICTEXT2"));
	helpSizer->Add(StaticText2, 1, wxALL|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 5);
	StaticBitmap1 = new wxStaticBitmap(helpPanel, ID_STATICBITMAP1, gd::SkinHelper::GetIcon("up", 16), wxDefaultPosition, wxDefaultSize, wxNO_BORDER, _T("ID_STATICBITMAP1"));
	helpSizer->Add(StaticBitmap1, 1, wxALL|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 5);
	helpPanel->SetSizer(helpSizer);
	helpSizer->Fit(helpPanel);
	helpSizer->SetSizeHints(helpPanel);
	FlexGridSizer3->Add(helpPanel, 1, wxALL|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 5);
	FlexGridSizer4->Add(FlexGridSizer3, 1, wxALL|wxEXPAND|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 0);
	corePanel->SetSizer(FlexGridSizer4);
	FlexGridSizer4->Fit(corePanel);
	FlexGridSizer4->SetSizeHints(corePanel);
	FlexGridSizer1->Add(corePanel, 1, wxALL|wxEXPAND|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 0);
	SetSizer(FlexGridSizer1);
	FlexGridSizer1->Fit(this);
	FlexGridSizer1->SetSizeHints(this);

	Connect(ID_COMBOBOX1,wxEVT_COMMAND_COMBOBOX_SELECTED,(wxObjectEventFunction)&ExternalLayoutEditor::OnparentSceneComboBoxSelected);
	Connect(ID_SCROLLBAR2,wxEVT_SCROLL_TOP|wxEVT_SCROLL_BOTTOM|wxEVT_SCROLL_LINEUP|wxEVT_SCROLL_LINEDOWN|wxEVT_SCROLL_PAGEUP|wxEVT_SCROLL_PAGEDOWN|wxEVT_SCROLL_THUMBTRACK|wxEVT_SCROLL_THUMBRELEASE|wxEVT_SCROLL_CHANGED,(wxObjectEventFunction)&ExternalLayoutEditor::OnscrollBar2Scroll);
	Connect(ID_SCROLLBAR1,wxEVT_SCROLL_TOP|wxEVT_SCROLL_BOTTOM|wxEVT_SCROLL_LINEUP|wxEVT_SCROLL_LINEDOWN|wxEVT_SCROLL_PAGEUP|wxEVT_SCROLL_PAGEDOWN|wxEVT_SCROLL_THUMBTRACK|wxEVT_SCROLL_THUMBRELEASE|wxEVT_SCROLL_CHANGED,(wxObjectEventFunction)&ExternalLayoutEditor::OnscrollBar1Scroll);
	layoutEditorCanvas->Connect(wxEVT_SET_FOCUS,(wxObjectEventFunction)&ExternalLayoutEditor::OnsceneCanvasSetFocus,0,this);
	layoutPanel->Connect(wxEVT_SIZE,(wxObjectEventFunction)&ExternalLayoutEditor::OnscenePanelResize,0,this);
	Connect(wxEVT_SIZE,(wxObjectEventFunction)&ExternalLayoutEditor::OnResize);
	//*)
    Connect(ID_SCROLLBAR1,wxEVT_SCROLL_CHANGED,(wxObjectEventFunction)&ExternalLayoutEditor::OnscrollBar1Scroll);
    Connect(ID_SCROLLBAR1,wxEVT_SCROLL_THUMBTRACK,(wxObjectEventFunction)&ExternalLayoutEditor::OnscrollBar1Scroll);
    Connect(ID_SCROLLBAR2,wxEVT_SCROLL_CHANGED,(wxObjectEventFunction)&ExternalLayoutEditor::OnscrollBar2Scroll);
    Connect(ID_SCROLLBAR2,wxEVT_SCROLL_THUMBTRACK,(wxObjectEventFunction)&ExternalLayoutEditor::OnscrollBar2Scroll);
	Connect(ID_COMBOBOX1,wxEVT_COMMAND_COMBOBOX_DROPDOWN,(wxObjectEventFunction)&ExternalLayoutEditor::OnparentSceneComboBoxDropDown);

	m_mgr.SetManagedWindow( this );

	externalEditorPanel = new ExternalEditorPanel(corePanel);
	FlexGridSizer3->Add(externalEditorPanel, 1, wxALL|wxEXPAND|wxALIGN_CENTER_HORIZONTAL|wxALIGN_CENTER_VERTICAL, 0);
 	externalEditorPanel->Connect(wxEVT_SIZE,(wxObjectEventFunction)&ExternalLayoutEditor::OnexternalEditorPanelResize,0,this);
	mainFrameWrapper.GetMainEditor()->Connect(wxEVT_MOVE,(wxObjectEventFunction)&ExternalLayoutEditor::OnexternalEditorPanelMoved,0,this);
	externalEditorPanel->OnOpenEditor([this]() {
		if (!externalLayoutEditor) return;

		if (externalLayoutEditor->IsLaunchedAndConnected())
			externalLayoutEditor->Show();
		else
			externalLayoutEditor->Launch("external-layout-editor", externalLayout.GetName());
	});

	//Prepare pane manager
    m_mgr.AddPane( corePanel, wxAuiPaneInfo().Name( wxT( "LayoutPanel" ) ).Center().CloseButton( false ).Caption( _( "Scene's editor" ) ).MaximizeButton( true ).MinimizeButton( false ).CaptionVisible(false) );

    gd::SkinHelper::ApplyCurrentSkin(m_mgr);

    Refresh();
}

void ExternalLayoutEditor::CreateExternalLayoutEditor()
{
	externalLayoutEditor = std::shared_ptr<gd::ExternalEditor>(new gd::ExternalEditor);
	externalLayoutEditor->OnSendUpdate([this](gd::String scope) {
		if (scope == "instances")
        {
			gd::SerializerElement serializedInstances;
			this->externalLayout.GetInitialInstances().SerializeTo(serializedInstances);
			return serializedInstances;
		}

		gd::SerializerElement serializedProject;
		gd::Project strippedProject = project;
		gd::ProjectStripper::StripProjectForExternalLayoutEdition(strippedProject, this->externalLayout.GetName());
		strippedProject.SerializeTo(serializedProject);

		return serializedProject;
	});
	externalLayoutEditor->OnUpdateReceived([this](gd::SerializerElement object, gd::String scope) {
		std::cout << "Updating \"" << scope << "\" from the external editor." << std::endl;

		gd::String name = externalLayout.GetAssociatedLayout();
	    gd::Layout * layout = project.HasLayoutNamed(name) ? &project.GetLayout(name) : NULL;
		if (scope == "instances")
			this->externalLayout.GetInitialInstances().UnserializeFrom(object);
		else if (scope == "uiSettings")
			this->externalLayout.GetAssociatedSettings().UnserializeFrom(object);
		else if (scope == "windowTitle" && layout)
			layout->SetWindowDefaultTitle(object.GetValue().GetString());
		else if (scope == "layers" && layout)
		{
			layout->UnserializeLayersFrom(object);
			if (layersEditor) layersEditor->Refresh();
		}
		else if (scope == "backgroundColor" && layout)
		{
			std::map<gd::String, unsigned int> rgbColor = {
				{"r", 0}, {"g", 0}, {"b", 0}
			};
			HexToRgb(object.GetValue().GetString().To<int>(), rgbColor);
			layout->SetBackgroundColor(rgbColor["r"], rgbColor["g"], rgbColor["b"]);
		}
		else
		{
			std::cout << "Updating \"" << scope << "\" is not supported." << std::endl;
		}
	});
	externalLayoutEditor->OnEditObject([this](const gd::String & objectName){
		gd::String name = externalLayout.GetAssociatedLayout();
	    gd::Layout * layout = project.HasLayoutNamed(name) ? &project.GetLayout(name) : NULL;
		if (!objectsEditor || !layout) return;

		externalLayoutEditor->Hide(true);
		if (layout->HasObjectNamed(objectName))
		{
			objectsEditor->SelectObject(layout->GetObject(objectName), false);
			objectsEditor->EditObject(layout->GetObject(objectName), false);
		}
		else if (project.HasObjectNamed(objectName))
		{
			objectsEditor->SelectObject(project.GetObject(objectName), true);
			objectsEditor->EditObject(project.GetObject(objectName), true);
		}
		else
		{
			std::cout << "Could not find object \"" << objectName << "\" to edit." << std::endl;
		}

		UpdateExternalLayoutEditorSize(true);
		externalLayoutEditor->Show();
	});
	externalLayoutEditor->OnLaunchPreview([this](){
		if (layoutEditorCanvas) layoutEditorCanvas->LaunchPreview();
	});
	externalLayoutEditor->OnLaunched([this]() {
		externalEditorPanel->HideLoader();
	});
	externalLayoutEditor->Launch("external-layout-editor", externalLayout.GetName());
}

ExternalLayoutEditor::~ExternalLayoutEditor()
{
	//(*Destroy(ExternalLayoutEditor)
	//*)

    //Save the configuration
    if ( &layoutEditorCanvas->GetLayout() != &emptyLayout ) wxConfigBase::Get()->Write("/ExternalLayoutEditor/LastWorkspace", m_mgr.SavePerspective());
	m_mgr.UnInit();
}

void ExternalLayoutEditor::Refresh()
{
    gd::String name = externalLayout.GetAssociatedLayout();
    gd::Layout * scene = project.HasLayoutNamed(name) ? &project.GetLayout(name) : NULL;

    if ( scene != NULL )
    {
        SetupForScene(*scene);
        parentSceneComboBox->SetValue(scene->GetName());
    }
	else
        SetupForScene(emptyLayout);
}

void ExternalLayoutEditor::OnResize(wxSizeEvent& event)
{
    Layout();

    //We're managing ourselves the size:
    contextPanel->SetSize(GetSize().GetWidth(), contextPanel->GetSize().GetHeight());
    layoutPanel->SetPosition(wxPoint(0,contextPanel->GetSize().GetHeight()));
    layoutPanel->SetSize(GetSize().GetWidth(),GetSize().GetHeight()-contextPanel->GetSize().GetHeight());
	if (externalEditorPanel)
	{
		externalEditorPanel->SetPosition(wxPoint(0,contextPanel->GetSize().GetHeight()));
		externalEditorPanel->SetSize(GetSize().GetWidth(),GetSize().GetHeight()-contextPanel->GetSize().GetHeight());
		UpdateExternalLayoutEditorSize();
	}
}

void ExternalLayoutEditor::OnscenePanelResize(wxSizeEvent& event)
{
    //Manual resizing of layout's panel
    layoutEditorCanvas->UpdateSize();

    scrollBar1->SetSize(0, layoutPanel->GetSize().GetHeight()-scrollBar1->GetSize().GetHeight(), layoutPanel->GetSize().GetWidth()-scrollBar2->GetSize().GetWidth(), scrollBar1->GetSize().GetHeight());
    scrollBar2->SetSize(layoutPanel->GetSize().GetWidth()-scrollBar2->GetSize().GetWidth(), 0, scrollBar2->GetSize().GetWidth(), layoutPanel->GetSize().GetHeight()-scrollBar1->GetSize().GetHeight());
}

void ExternalLayoutEditor::UpdateExternalLayoutEditorSize(bool force)
{
	if (!externalLayoutEditor) return;
	if (!isEditorDisplayed && !force) return;

	auto rect = corePanel->GetScreenRect();
	rect.SetY(rect.GetY() + contextPanel->GetSize().GetHeight());
	rect.SetHeight(rect.GetHeight() - contextPanel->GetSize().GetHeight());
	externalLayoutEditor->SetBounds(rect.GetX(), rect.GetY(), rect.GetWidth(), rect.GetHeight());
}

void ExternalLayoutEditor::OnexternalEditorPanelMoved(wxMoveEvent& event)
{
	UpdateExternalLayoutEditorSize();
	event.Skip();
}

void ExternalLayoutEditor::OnexternalEditorPanelResize(wxSizeEvent& event)
{
	UpdateExternalLayoutEditorSize();
	event.Skip();
}

void ExternalLayoutEditor::OnscrollBar2Scroll(wxScrollEvent& event)
{
    layoutEditorCanvas->OnvScrollbarScroll(event);
}

void ExternalLayoutEditor::OnscrollBar1Scroll(wxScrollEvent& event)
{
    layoutEditorCanvas->OnhScrollbarScroll(event);
}

void ExternalLayoutEditor::EditorDisplayed()
{
	isEditorDisplayed = true;
	mainFrameWrapper.SetRibbonPage(_("Scene"));
    if (layoutEditorCanvas) layoutEditorCanvas->ConnectEvents();
	if (externalLayoutEditor)
	{
		UpdateExternalLayoutEditorSize();
		externalLayoutEditor->Show();
	}
}

void ExternalLayoutEditor::EditorNotDisplayed()
{
	isEditorDisplayed = false;
	if (externalLayoutEditor)
	{
		externalLayoutEditor->Hide();
	}
}

void ExternalLayoutEditor::OnsceneCanvasSetFocus(wxFocusEvent& event)
{
    mainFrameWrapper.SetRibbonPage(_("Scene"));
    layoutEditorCanvas->ConnectEvents();
}

void ExternalLayoutEditor::SetupForScene(gd::Layout & layout)
{
    bool useExternalEditor = false;
    wxConfigBase::Get()->Read("/SceneEditor/ExternalSceneEditor", &useExternalEditor, false);

    if ( &layout == &emptyLayout )
    {
        layoutPanel->Hide();
        externalEditorPanel->Hide();
        helpPanel->Show();
    }
    else
    {
		if (useExternalEditor)
		{
	        layoutPanel->Hide();
	        externalEditorPanel->Show();
	        helpPanel->Hide();

	        CreateExternalLayoutEditor();
		} else {
	        layoutPanel->Show();
	        externalEditorPanel->Hide();
	        helpPanel->Hide();
		}

        gd::InitialInstancesContainer & instanceContainer = externalLayout.GetInitialInstances();

        //Destroy any existing editor
        if (objectsEditor != std::shared_ptr<ObjectsEditor>())
            m_mgr.DetachPane(objectsEditor.get());
        if (layersEditor != std::shared_ptr<LayersEditorPanel>())
            m_mgr.DetachPane(layersEditor.get());
        if (propertiesPnl != std::shared_ptr<LayoutEditorPropertiesPnl>())
            m_mgr.DetachPane(propertiesPnl.get());
        if (initialInstancesBrowser != std::shared_ptr<InitialPositionBrowserDlg>())
            m_mgr.DetachPane(initialInstancesBrowser.get());

        //(Re)create layout canvas
        if ( layoutEditorCanvas ) delete layoutEditorCanvas;
        layoutEditorCanvas = new gd::LayoutEditorCanvas(layoutPanel, project, layout, instanceContainer, externalLayout.GetAssociatedSettings(), mainFrameWrapper, &externalLayout);
        layoutEditorCanvas->SetParentAuiManager( &m_mgr );
        layoutEditorCanvas->SetScrollbars(scrollBar1, scrollBar2);

        //Creating external editors and linking them to the layout canvas
        objectsEditor = std::make_shared<gd::ObjectsEditor>(this, project, layout, mainFrameWrapper);
        layersEditor = std::make_shared<LayersEditorPanel>(this, project, layout, mainFrameWrapper);
        propertiesPnl = std::make_shared<LayoutEditorPropertiesPnl>(this, project, layout, layoutEditorCanvas, mainFrameWrapper);
        initialInstancesBrowser = std::make_shared<InitialPositionBrowserDlg>(this, instanceContainer, *layoutEditorCanvas);

        layoutEditorCanvas->AddAssociatedEditor(objectsEditor.get());
        layoutEditorCanvas->AddAssociatedEditor(layersEditor.get());
        layoutEditorCanvas->AddAssociatedEditor(propertiesPnl.get());
        layoutEditorCanvas->AddAssociatedEditor(initialInstancesBrowser.get());
        layersEditor->SetAssociatedLayoutEditorCanvas(layoutEditorCanvas);
        objectsEditor->SetAssociatedPropertiesPanel(propertiesPnl.get(), &m_mgr);

        //Display editors in panes
        m_mgr.AddPane( objectsEditor.get(), wxAuiPaneInfo().Name( wxT( "EO" ) ).Right().CloseButton( true ).Caption( _( "Objects' editor" ) ).MaximizeButton( true ).MinimizeButton( false ).CaptionVisible(true).MinSize(208, 100) );
        m_mgr.AddPane( layersEditor.get(), wxAuiPaneInfo().Name( wxT( "EL" ) ).Right().CloseButton( true ).Caption( _( "Layers' editor" ) ).MaximizeButton( true ).MinimizeButton( false ).CaptionVisible(true).MinSize(208, 100).Show(false) );
        m_mgr.AddPane( propertiesPnl.get(), wxAuiPaneInfo().Name( wxT( "PROPERTIES" ) ).Float().CloseButton( true ).Caption( _( "Properties" ) ).MaximizeButton( true ).MinimizeButton( false ).CaptionVisible(true).MinSize(50, 50).BestSize(230,200).Show(true) );
        m_mgr.AddPane( initialInstancesBrowser.get(), wxAuiPaneInfo().Name( wxT( "InstancesBrowser" ) ).Float().CloseButton( true ).Caption( _( "Instances list" ) ).MaximizeButton( true ).MinimizeButton( false ).CaptionVisible(true).MinSize(50, 50).BestSize(230,200).Show(true) );

        wxString perspective;
        wxConfigBase::Get()->Read("/ExternalLayoutEditor/LastWorkspace", &perspective);
        m_mgr.LoadPerspective(perspective);

		objectsEditor->OnChange([this](gd::String changeScope) {
			if (!externalLayoutEditor) return;

			if (changeScope == "object-added")
				externalLayoutEditor->SendUpdate("", true);
			else
				externalLayoutEditor->SetDirty();
		});
		layersEditor->OnChange([this](gd::String changeScope) {
			if (externalLayoutEditor) externalLayoutEditor->SetDirty();
		});

        m_mgr.Update();
        EditorDisplayed();
    }

    //Save the choice
    externalLayout.SetAssociatedLayout(layout.GetName());

    if (onAssociatedLayoutChangedCb) onAssociatedLayoutChangedCb();
}

void ExternalLayoutEditor::OnparentSceneComboBoxSelected(wxCommandEvent& event)
{
	if (externalLayoutEditor) externalLayoutEditor->Show();
    gd::String name = parentSceneComboBox->GetValue();
    gd::Layout * scene = project.HasLayoutNamed(name) ? &project.GetLayout(name) : NULL;

    if ( parentSceneComboBox->GetSelection() == 0 ) //0 i.e. "No scene"
        scene = &emptyLayout;
    else if ( scene == NULL)
    {
        gd::LogWarning(_("Scene not found."));
        return;
    }

    SetupForScene(*scene);
}

/**
 * Update layout list.
 */
void ExternalLayoutEditor::OnparentSceneComboBoxDropDown(wxCommandEvent& event)
{
	if (externalLayoutEditor) externalLayoutEditor->Hide(true);
    parentSceneComboBox->Clear();
    parentSceneComboBox->Append(_("No layout"));

    for (std::size_t i = 0;i<project.GetLayoutsCount();++i)
    	parentSceneComboBox->Append(project.GetLayout(i).GetName());
}

gd::Layout & ExternalLayoutEditor::GetAssociatedLayout()
{
    return layoutEditorCanvas->GetLayout();
}
