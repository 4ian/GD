<?php
/*
Fichier de configuration pour l'affichage et l'envoi de donn�es par internet pour Game Develop.
Remplissez ce fichier pour personnaliser l'enregistrement et l'affichage des donn�es du joueur.

Cr�e par 4ian ( Compil Games )
Ce fichier est dans le domaine public. Vous pouvez l'�diter et l'utiliser librement.
N'h�sitez pas � faire part de vos am�liorations sur le site de Game Develop : www.compilgames.net
*/

//--------------------------------------------------
//Personnalisations indispensables
//--------------------------------------------------

//Mot de passe de s�curit�.
//Afin de garantir la s�curit� et la fiablit� des donn�es envoy�s par votre jeu, choisissez un mot de passe,
//et entrez le ici. Le mot de passe doit �tre le m�me entre ce fichier et votre jeu.
$mdp = "remplacez ceci par votre mot de passe";

//Titre des colonnes.
// Pour chaque donn�es envoy�es, vous pouvez personnaliser le titre affich� dans le tableau
// Laissez vide pour ne rien afficher.
$titre1 = "Score";
$titre2 = "Niveau";
$titre3 = "";
$titre4 = "";
$titre5 = "";
$titre6 = "";

//Modifiez l'ordre d'affichage en choississant la donn�e � trier et
//choississez si le tri doit �tre croissant ( "C" ) ou d�croissant ( "D" ) 
$datatri = 1;
$typetri = "D";

//--------------------------------------------------
//Autres personnalisations
//--------------------------------------------------

//Message d'erreur lors de la v�rification des donn�es
$erreurCheck = "<b>Erreur lors de la v�rification des donn�es.</b><br /><br />Les donn�es transmises semblent �tre invalides.<br />-V�rifiez que vous poss�dez la derni�re version du jeu.<br />-R�essayez de renvoyer les donn�es depuis le jeu.<br />-Contactez l'auteur du jeu si le probl�me persiste.<br />";

//Message pour ins�rer le pseudonyme
$pseudoMsg = "Entrez votre nom ou pseudonyme :";

//Message de remerciement
$enregistreMsg = "Vos donn�es ont �t� correctement enregistr�es !<br/><br/><a href=\"view.php\" >Cliquez ici pour acc�der au tableau complet !</a>";

//Message donn�es d�j� existante
$ExistMsg = "<b>Impossible d'ajouter les donn�es.</b><br/><br/>Les donn�es existent d�j� dans la base de donn�es.";

//Titre du tableau r�capitulatif
$TitreTableau = "Tableau des scores :";

?>