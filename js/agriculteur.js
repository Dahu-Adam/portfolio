$(document).ready(function () {

    // AFFICHAGE DU TABLEAU DE agriculteurS ***************************************************************************************************



    function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );
    
        if ( param ) {
            return vars[param] ? vars[param] : null;    
        }
        return vars;
    }



    function afficheAgriculteur() {
        params = 'action=affiche_agriculteur&id_agriculteur=';
        params += decodeURI( $_GET( 'id_agriculteur' ) );
        console.log (params);
        $.post('controller_agriculteur.php',  // URL du dossier où s'effectue le traitement
            params, // Valeur à 'envoyer', ici pas de valeurs à envoyer uniquement une indication pour le traitement
            function (agriculteur) {
                if (agriculteur.length > 0) {
                    let tab = '';
                
                        tab += '<tr>';
                        tab += '<td>' + agriculteur[0].nom + '</td>';
                        tab += '<td>' + agriculteur[0].prenom + '</td>';
                        tab += '<td>' + agriculteur[0].adresse + '</td>';
                        tab += '<td>' + agriculteur[0].cp + '</td>';
                        tab += '<td>' + agriculteur[0].ville + '</td>';
                        tab += '<td>' + agriculteur[0].tel + '</td>';
                        tab += '<td>' + agriculteur[0].mail + '</td>';
                        tab += '<td>' + agriculteur[0].pseudo + '</td>';
                        tab += '<td>' + agriculteur[0].date_creation_compte + '</td>';
                        tab += '<td><i id=' + agriculteur[0].id_agriculteur + ' class="modifier fas fa-pen blue-text"></i></td>';
                        tab += '</tr>';
                    
                    $('.insert').append(tab);
                }
            }, 'json'); // format attendu pour le retour
    }  // fin de la fonction afficheagriculteur

    afficheAgriculteur();

    

    // EFFACEMENT D'UN agriculteur *************************************************************************************************************

    $('.insert').on('click', '.effacer', function (e) {
        e.preventDefault();
        let efface_id = $(this).attr('id');
        let ligne_a_effacer = $(this).closest('tr');
        let choix = confirm('Voulez vous effacer le agriculteur n° ' + efface_id);
        if (choix) {
            // traitement ajax de l'effacement
            params = 'action=supprime_agriculteur&id_agriculteur=' + efface_id;
            
            $.post('controller_agriculteur.php', // URL du dossier où s'effectue le traitement
                params,  // Valeurs à 'envoyer' contenues dans la variable params
                function (supprime) {
                    if (supprime) {
                        // on efface uniquement la ligne qui vient d'être effacé en BDD dans le tableau
                        ligne_a_effacer.remove();
                    }
                }, 'json');	// fin de l'ajax   	
        }
    }); // fin de l'event d'effacement


    // UPDATE D'UN agriculteur ****************************************************************************************************************
    // ouverture de la modal avec les infos de l'agriculteur à modifier
    var update_id = ''; // sauvegarde de l'id de l'agriculteur à modifier utilisé dans les deux fonctions Ajax qui suivent
    var ligne_a_modifier = '';

    $('.insert').on('click', '.modifier', function (e) {
        e.preventDefault();
        update_id = $(this).attr('id');
        ligne_a_modifier = $(this).closest('tr');
        infos_agriculteur = 'action=get_agriculteur&id_agriculteur=' + update_id;
        $.post('controller_agriculteur.php', // URL du dossier où s'effectue le traitement
            infos_agriculteur,  // Valeurs à 'envoyer' contenues dans la variable params
            function (infos) {
                $('.modal-title').html('Modification de l\'agriculteur ' + infos.nom +' ' +infos.prenom);
                $('#nom_update').val(infos.nom);
                $('#prenom_update').val(infos.prenom);
                $('#adresse_update').val(infos.adresse);
                $('#cp_update').val(infos.cp);
                $('#ville_update').val(infos.ville);
                $('#tel_update').val(infos.tel);
                $('#mail_update').val(infos.mail);
                $('#pseudo_update').val(infos.pseudo);
                $('#date_creation_compte_update').val(infos.date_creation_compte);
                $('#modalLoginForm').modal('show');
            }, 'json');	// fin de l'ajax
    });

    // validation des modifications et mise à jour de la BDD

    $("#btnSaveIt").on('click', function (e) {
        e.preventDefault();
        
   
        let update_nom = $('#nom_update').val();
        let update_prenom = $('#prenom_update').val();
        let update_adresse = $('#adresse_update').val();
        let update_cp = $('#cp_update').val();
        let update_ville = $('#ville_update').val();
        let update_tel = $('#tel_update').val();
        let update_mail = $('#mail_update').val();
        let update_pseudo = $('#pseudo_update').val();
        let update_date_creation_compte = $('#date_creation_compte_update').val();

        
        let params = 'action=modification_agriculteur&' + $('#agriculteur_update').serialize() + '&id_agriculteur=' + update_id;
    //   console.log (params);
        $.post('controller_agriculteur.php', // URL du dossier où s'effectue le traitement
            params,  // Valeurs à 'envoyer' contenues dans la variable params
            function (update) {
                if (update) {
                    // on ne va remettre à jour à l'écran uniquement la ligne qui vient d'être modifié en BDD dans le tableau
                    let ligne = '';
                    ligne += '<tr>';
                    // ligne += '<td>' + update_id + '</td>';
                    ligne += '<td>' + update_nom + '</td>';
                    ligne += '<td>' + update_prenom + '</td>';
                    ligne += '<td>' + update_adresse + '</td>';
                    ligne += '<td>' + update_cp + '</td>';
                    ligne += '<td>' + update_ville + '</td>';
                    ligne += '<td>' + update_tel + '</td>';
                    ligne += '<td>' + update_mail + '</td>';
                    ligne += '<td>' + update_pseudo + '</td>';
                    ligne += '<td>' + update_date_creation_compte + '</td>';
                    ligne += '<td><i id=' + update_id + ' class="modifier fas fa-pen blue-text"></i></td>';
                    // ligne += '<td><i id=' + update_id + ' class="effacer fas fa-times blue-text"></i></td>';
                    ligne += '</tr>';
                    ligne_a_modifier.replaceWith(ligne);
                }
                $('#modalLoginForm').modal('hide');
                $('#agriculteur_update')[0].reset();  // reset du formulaire pour effacer les champs juste pour être propre !!s                
                update_id = ''; // on reset les variables de sauvegarde toujours pour être propre !!
                ligne_a_modifier = '';
            }, 'json');	// fin de l'ajax
    });

}) //fin du document ready