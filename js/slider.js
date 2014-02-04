// jQuery-Beispielprojekt
// jQuery-Beispiel: Zoombare Bildnavigation
// Herbert Braun, Redaktion c't, Juni 2009
// zu: Herbert Braun, Kompakt-Skripte, Die JavaScript-Bibliothek jQuery im Einsatz, c't 14/09, S. 180
// Korrektur 11.8.09: parseInt()-Problem in Firefox behoben (thx Noud!)

// Nummer des angezeigten Bildes anhand der URL ermitteln
// xxxpfad/heft05.html -> 5 (Zahl)
// var angezeigtes_bild = parseInt(.substr(-7, 2));
// ... geht nicht im IE, also:
var loc = document.location.href;
var angezeigtes_bild = parseInt(loc.substr(loc.length-7, 2), 10); // Argument 10 erzwingt Dezimalzahlen (Firefox interpretiert 01 etc. als Oktalzahl)
var sichtbare = 9; // Anzahl sichtbarer Bilder (nur ungerade Zahlen)
var zoom = 2; // Zoomfaktor beim Hover (besser nicht ändern)
var bildborder = 1; // Pixel
var bildabstand = 5; // Pixel (rechts)

$(function() { // nachdem das Dokument eingelesen ist:
  var $pix = $('#panel li a img'); // alle Bilder
  var $li = $('#panel li'); // alle Listenelemente
  $pix.css({ // CSS-Anweisungen
    'border-width': bildborder,
    'margin-right': bildabstand
  });
  var bildbreite = $pix.width(); // Bildbreite und -höhe einlesen
  var bildhoehe = $pix.height();
  var panelbreite = (sichtbare + 2) * bildbreite + sichtbare * (bildabstand + bildborder * 2); // minimal notwendige Panelbreite errechnen
  $('#panel').width(panelbreite);
  var anzahl = $li.length; // Anzahl aller Bilder
  if (!(sichtbare % 2)) sichtbare++; // sichtbare ist nun auf jeden Fall ungerade
  var versatz = (sichtbare - 1) / 2; // Anzahl der Bilder links und rechts von angezeigtes_bild
  var erstes_sichtbar = angezeigtes_bild - versatz;
  var letztes_sichtbar = angezeigtes_bild + versatz;

  $pix.hover(
    function() { // bei Mouseover der Bilder:
      $(this).stop().animate({ // evtl. Animation beenden und eine neue beginnen
       width: (bildbreite * zoom), // Bild zoomen
       height: (bildhoehe * zoom)
      });
    },
    function() { // bei Mouseout der Bilder:
      $(this).stop().animate({ // evtl. Animation beenden und eine neue beginnen
       width: bildbreite, // Bild auszoomen
       height: bildhoehe
      });
    }
  );

  var bildlauf = function() { // Scrollen vorbereiten
    $('#bildlauf_links, #bildlauf_rechts').removeClass('klickbar').unbind(); // eventuelle Bildlauf-Funktionen annullieren
    if (erstes_sichtbar > 1) $('#bildlauf_links').addClass('klickbar').click(bildlauf_links); // Wenn links ...
    // ... oder rechts verborgene Bilder sind, dann die entsprechende Schaltfläche als klickbar kennzeichnen und mit einer Klick-Funktion verbinden
    if (anzahl > letztes_sichtbar) $('#bildlauf_rechts').addClass('klickbar').click(bildlauf_rechts);
  }

  var bildlauf_links = function() { // Scrollen nach links
    erstes_sichtbar--; // Zähler anpassen
    letztes_sichtbar--;
    // Die Funktion beginnt bei null zu zählen, die Variablen (erstes_sichtbar, letztes_sichtbar) sind "menschlich" gezählt, also ab Nummer 1
    $li.eq(erstes_sichtbar - 1).show(); // erstes verborgenes Bild zeigen
    $li.eq(letztes_sichtbar).hide(); // letztes sichtbare Bild verbergen
    bildlauf(); // wechselt zur Scroll-Vorbereitungsfunktion
  }
  var bildlauf_rechts = function() {
    $li.eq(erstes_sichtbar - 1).hide(); // erstes sichtbares Bild verbergen
    $li.eq(letztes_sichtbar).show(); // letztes verborgenes Bild zeigen
    erstes_sichtbar++;
    letztes_sichtbar++;
    bildlauf();
  }

  if (erstes_sichtbar < 1) { // Zähler anpassen, wenn das angezeigte Bild nahe am Anfang ...
    erstes_sichtbar = 1;
    letztes_sichtbar = sichtbare;
  } else if (letztes_sichtbar > anzahl) { // ... oder am Ende der Liste steht
    erstes_sichtbar = anzahl - sichtbare + 1;
    letztes_sichtbar = anzahl;
  }
  $li.slice(0, erstes_sichtbar - 1).hide(); // verbirgt die Bilder vor dem ersten sichtbaren
  $li.slice(letztes_sichtbar).hide(); // verbirgt die Bilder nach dem letzten sichtbaren
  $li.eq(0).before('<li id="bildlauf_links"></li>'); // fügt die Schaltflächen ein
  $li.eq(anzahl - 1).after('<li id="bildlauf_rechts"></li>');
  bildlauf(); // Scrollfunktion vorbereiten
});
