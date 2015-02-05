<?php 
/*
Affichage du tableau r�capitulatif des donn�es.

Cr�e par 4ian ( Compil Games )

Ce fichier est dans le domaine public. Vous pouvez l'�diter et l'utiliser librement.
N'h�sitez pas � faire part de vos am�liorations sur le site de Game Develop : www.compilgames.net
*/

include_once("config.php");

//Fonction de classement
function cmp1($a,$b) {
	if ( $GLOBALS['typetri'] == "D" )
	{
		return ($a[$GLOBALS['datatri']] > $b[$GLOBALS['datatri']]) ? -1 : 1;
	}
	else if ( $GLOBALS['typetri'] == "C" )
	{
		return ($a[$GLOBALS['datatri']] < $b[$GLOBALS['datatri']]) ? -1 : 1;
	}
}

//Ouverture des donn�es
$datas = fopen('datas.txt', 'r+');
$i = 0;

//On parcourt ligne par ligne le fichier
while(!feof($datas)) {

	//On lit la ligne
	$total = fgets($datas);
	$contenu[$i] = explode("|", $total); //On la d�coupe avec les |
	
	$i++;
}

//On trie les donn�es
usort($contenu, "cmp1");

//Cr�ation du tableau
echo "<b>".$TitreTableau."</b><br/><br/>";
echo "<table BORDER><tr>";
echo "<td><b>Pseudonyme</b></td>";
if ( $titre1 != "" ) {
	echo "<td><b>".$titre1."</b></td>"; }
if ( $titre2 != "" ) {
	echo "<td><b>".$titre2."</b></td>"; }
if ( $titre3 != "" ) {
	echo "<td><b>".$titre3."</b></td>"; }
if ( $titre4 != "" ) {
	echo "<td><b>".$titre4."</b></td>"; }
if ( $titre5 != "" ) {
	echo "<td><b>".$titre5."</b></td>"; }
if ( $titre6 != "" ) {
	echo "<td><b>".$titre6."</b></td>"; }
	
echo "</tr><tr>";

//Affichage des donn�es du tableau
foreach($contenu as $ligne)
{
	echo "<tr>";
	foreach($ligne as $elem)
	{
		if ( $elem != "" )
			echo "<td>".$elem."</td>";
	}
	echo "</tr>";
}

echo "</tr></table>";


		
?>