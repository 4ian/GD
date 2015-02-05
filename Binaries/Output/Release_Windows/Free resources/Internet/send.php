<?php 
/*
R�cup�ration des donn�es envoy�es par Game Develop

Cr�e par 4ian ( Compil Games )

Ce fichier est dans le domaine public. Vous pouvez l'�diter et l'utiliser librement.
N'h�sitez pas � faire part de vos am�liorations sur le site de Game Develop : www.compilgames.net
*/

include_once("config.php");

//R�cup�ration des donn�es
$data1 = $_GET['data1']; //Les donn�es brutes
$data2 = $_GET['data2'];
$data3 = $_GET['data3'];
$data4 = $_GET['data4'];
$data5 = $_GET['data5'];
$data6 = $_GET['data6'];

$check1 = $_GET['check1']; //Leurs codes de v�rification
$check2 = $_GET['check2'];
$check3 = $_GET['check3'];
$check4 = $_GET['check4'];
$check5 = $_GET['check5'];
$check6 = $_GET['check6'];

//On r�cr�� "la ligne de commande" maintenant, pour la renvoyer ensuite apr�s insertion du pseudo
$commandline = 	"?data1=".$data1."&check1=".$check1.
				"&data2=".$data2."&check2=".$check2.
				"&data3=".$data3."&check3=".$check3.
				"&data4=".$data4."&check4=".$check4.
				"&data5=".$data5."&check5=".$check5.
				"&data6=".$data6."&check6=".$check6;

//V�rification de la validit� des donn�es
if (md5($data1.$mdp) != $check1 ||
	md5($data2.$mdp) != $check2 ||
	md5($data3.$mdp) != $check3 ||
	md5($data4.$mdp) != $check4 ||
	md5($data5.$mdp) != $check5 ||
	md5($data6.$mdp) != $check6)
{
	echo $erreurCheck; //Erreur de v�rification, une donn�e est peut �tre falsifi�e
}

//On propose en premier d'entrer le pseudonyme du joueur
else if(empty($_POST['posted'])) {
	//Affichage du formulaire. La page � executer ensuite est celle ci. On renvoye aussi au passage les donn�es.
	echo "<form enctype=\"multipart/form-data\" action=\"";?><?php echo $PHP_SELF; ?><?php echo $commandline."\" method=\"POST\">
		<b>".$pseudoMsg."</b><br /><br />
		<input type=\"hidden\" name=\"posted\" value=\"1\" />
		<input name=\"pseudo\" type=\"text\" />
		<input type=\"submit\" value=\"Envoyer\" /> </form>";
}
//Ensuite, on inscrit les donn�es
else
{
	//On va d'abord ouvrir le fichier de donn�es pour v�rifier les doublons
	$datas = fopen('datas.txt', 'r+');
	$i = 0;
	//Lecture ligne par ligne du fichier de donn�es
	while(!feof($datas)) {

		//On lit la ligne
		$total = fgets($datas);
		$contenu[$i] = explode("|", $total); //On la d�coupe avec les "|"
		
		$i++;
	}
	
	//On v�rifie que les donn�es n'existent pas d�j�
	$Exist = false;
	foreach($contenu as $ligne)
	{
		if ($ligne[0]==$_POST['pseudo'] && 
			$ligne[1]==$data1 &&
			$ligne[2]==$data2 &&
			$ligne[3]==$data3 &&
			$ligne[4]==$data4 &&
			$ligne[5]==$data5 && 
			$ligne[6]==$data6."\n")
		{
			$Exist = true; //Les donn�es existent d�j�, on ne les inscrira pas
		}
	}
	if ( $Exist == false )
	{
		//On enregistre les donn�es
		$datas = fopen('datas.txt', 'a+');
		fputs($datas, $_POST['pseudo']."|".$data1."|".$data2."|".$data3."|".$data4."|".$data5."|".$data6."\n");
		fclose($datas);
		
		echo $enregistreMsg;
	}
	else
	{
		echo $ExistMsg;
	}
}

		
?>