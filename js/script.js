// Script pour la navigation et les fonctionnalités interactives
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
        });
    }
    
    // Gestion du thème sombre/clair
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Vérifier si un thème est déjà enregistré
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = '🌓';
            }
        });
    }
    
    // Gestion des calculateurs
    const calculateurs = document.querySelectorAll('.calculateur');
    
    calculateurs.forEach(calculateur => {
        const form = calculateur.querySelector('form');
        const resultat = calculateur.querySelector('.resultat');
        
        if (form && resultat) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Logique spécifique à chaque calculateur
                const calculateurId = calculateur.id;
                
                if (calculateurId === 'calculateur-comparaison') {
                    // Calculateur méthode par comparaison
                    const prixRef = parseFloat(form.querySelector('#prix-ref').value);
                    const surfaceRef = parseFloat(form.querySelector('#surface-ref').value);
                    const ajustement = parseFloat(form.querySelector('#ajustement').value) / 100;
                    const surfaceBien = parseFloat(form.querySelector('#surface-bien').value);
                    
                    const prixM2 = prixRef / surfaceRef;
                    const prixM2Ajuste = prixM2 * (1 + ajustement);
                    const estimation = prixM2Ajuste * surfaceBien;
                    
                    resultat.innerHTML = `
                        <h4>Résultat de l'estimation</h4>
                        <p>Prix au m² de référence : ${prixM2.toFixed(2)} €/m²</p>
                        <p>Prix au m² ajusté : ${prixM2Ajuste.toFixed(2)} €/m²</p>
                        <p>Estimation finale : ${Math.round(estimation).toLocaleString()} €</p>
                    `;
                } else if (calculateurId === 'calculateur-hedoniste') {
                    // Calculateur méthode hédoniste
                    const prixBase = parseFloat(form.querySelector('#prix-base').value);
                    const surface = parseFloat(form.querySelector('#surface').value);
                    const valorisationEtage = parseFloat(form.querySelector('#valorisation-etage').value);
                    const valorisationExterieur = parseFloat(form.querySelector('#valorisation-exterieur').value);
                    const valorisationEtat = parseFloat(form.querySelector('#valorisation-etat').value);
                    
                    const estimation = (prixBase * surface) + valorisationEtage + valorisationExterieur + valorisationEtat;
                    
                    resultat.innerHTML = `
                        <h4>Résultat de l'estimation</h4>
                        <p>Valeur de base : ${(prixBase * surface).toLocaleString()} €</p>
                        <p>Valorisation étage : ${valorisationEtage.toLocaleString()} €</p>
                        <p>Valorisation extérieur : ${valorisationExterieur.toLocaleString()} €</p>
                        <p>Valorisation état : ${valorisationEtat.toLocaleString()} €</p>
                        <p>Estimation finale : ${Math.round(estimation).toLocaleString()} €</p>
                    `;
                } else if (calculateurId === 'calculateur-rendement') {
                    // Calculateur méthode du rendement
                    const loyerMensuel = parseFloat(form.querySelector('#loyer-mensuel').value);
                    const tauxCharges = parseFloat(form.querySelector('#taux-charges').value) / 100;
                    const tauxVacance = parseFloat(form.querySelector('#taux-vacance').value) / 100;
                    const tauxRendement = parseFloat(form.querySelector('#taux-rendement').value) / 100;
                    
                    const revenuAnnuel = loyerMensuel * 12;
                    const charges = revenuAnnuel * tauxCharges;
                    const vacance = revenuAnnuel * tauxVacance;
                    const revenuNet = revenuAnnuel - charges - vacance;
                    const estimation = revenuNet / tauxRendement;
                    
                    resultat.innerHTML = `
                        <h4>Résultat de l'estimation</h4>
                        <p>Revenu brut annuel : ${revenuAnnuel.toLocaleString()} €</p>
                        <p>Charges non récupérables : ${charges.toLocaleString()} €</p>
                        <p>Provision vacance : ${vacance.toLocaleString()} €</p>
                        <p>Revenu net annuel : ${revenuNet.toLocaleString()} €</p>
                        <p>Estimation finale : ${Math.round(estimation).toLocaleString()} €</p>
                    `;
                } else if (calculateurId === 'calculateur-cout') {
                    // Calculateur méthode du coût
                    const valeurTerrain = parseFloat(form.querySelector('#valeur-terrain').value);
                    const coutConstruction = parseFloat(form.querySelector('#cout-construction').value);
                    const surface = parseFloat(form.querySelector('#surface-construction').value);
                    const tauxDepreciation = parseFloat(form.querySelector('#taux-depreciation').value) / 100;
                    
                    const coutTotal = coutConstruction * surface;
                    const depreciation = coutTotal * tauxDepreciation;
                    const valeurBati = coutTotal - depreciation;
                    const estimation = valeurTerrain + valeurBati;
                    
                    resultat.innerHTML = `
                        <h4>Résultat de l'estimation</h4>
                        <p>Valeur du terrain : ${valeurTerrain.toLocaleString()} €</p>
                        <p>Coût de construction total : ${coutTotal.toLocaleString()} €</p>
                        <p>Dépréciation : ${depreciation.toLocaleString()} €</p>
                        <p>Valeur du bâti après dépréciation : ${valeurBati.toLocaleString()} €</p>
                        <p>Estimation finale : ${Math.round(estimation).toLocaleString()} €</p>
                    `;
                } else if (calculateurId === 'calculateur-bilan') {
                    // Calculateur méthode du bilan promoteur
                    const prixVente = parseFloat(form.querySelector('#prix-vente').value);
                    const surface = parseFloat(form.querySelector('#surface-constructible').value);
                    const coutConstruction = parseFloat(form.querySelector('#cout-construction').value);
                    const tauxFrais = parseFloat(form.querySelector('#taux-frais').value) / 100;
                    const tauxMarge = parseFloat(form.querySelector('#taux-marge').value) / 100;
                    
                    const chiffreAffaires = prixVente * surface;
                    const coutTotal = coutConstruction * surface;
                    const frais = coutTotal * tauxFrais;
                    const marge = chiffreAffaires * tauxMarge;
                    const chargeFonciere = chiffreAffaires - coutTotal - frais - marge;
                    
                    resultat.innerHTML = `
                        <h4>Résultat de l'estimation</h4>
                        <p>Chiffre d'affaires : ${chiffreAffaires.toLocaleString()} €</p>
                        <p>Coût de construction : ${coutTotal.toLocaleString()} €</p>
                        <p>Frais annexes : ${frais.toLocaleString()} €</p>
                        <p>Marge promoteur : ${marge.toLocaleString()} €</p>
                        <p>Charge foncière maximale : ${Math.round(chargeFonciere).toLocaleString()} €</p>
                    `;
                }
                
                resultat.style.display = 'block';
            });
        }
    });
    
    // Gestion des quiz
    const quizzes = document.querySelectorAll('.quiz');
    
    quizzes.forEach(quiz => {
        const questions = quiz.querySelectorAll('.question');
        const options = quiz.querySelectorAll('.option');
        const quizResult = quiz.querySelector('.quiz-result');
        
        if (options.length > 0) {
            options.forEach(option => {
                option.addEventListener('click', function() {
                    // Désélectionner les autres options de la même question
                    const questionContainer = option.closest('.question');
                    const questionOptions = questionContainer.querySelectorAll('.option');
                    
                    questionOptions.forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Sélectionner l'option cliquée
                    option.classList.add('selected');
                    
                    // Afficher le feedback
                    const feedback = questionContainer.querySelector('.feedback');
                    if (feedback) {
                        if (option.dataset.correct === 'true') {
                            feedback.classList.add('correct');
                            feedback.classList.remove('incorrect');
                            feedback.textContent = 'Correct ! ' + option.dataset.explanation;
                        } else {
                            feedback.classList.add('incorrect');
                            feedback.classList.remove('correct');
                            feedback.textContent = 'Incorrect. ' + option.dataset.explanation;
                        }
                        feedback.style.display = 'block';
                    }
                    
                    // Vérifier si toutes les questions ont été répondues
                    const selectedOptions = quiz.querySelectorAll('.option.selected');
                    if (selectedOptions.length === questions.length && quizResult) {
                        // Calculer le score
                        let correctAnswers = 0;
                        selectedOptions.forEach(selected => {
                            if (selected.dataset.correct === 'true') {
                                correctAnswers++;
                            }
                        });
                        
                        const score = Math.round((correctAnswers / questions.length) * 100);
                        
                        // Afficher le résultat
                        quizResult.innerHTML = `
                            <h4>Résultat du quiz</h4>
                            <p>Vous avez obtenu ${correctAnswers} réponse(s) correcte(s) sur ${questions.length}, soit un score de ${score}%.</p>
                            <p>${score >= 70 ? 'Félicitations !' : 'Continuez à vous entraîner pour améliorer votre score.'}</p>
                        `;
                        quizResult.style.display = 'block';
                    }
                });
            });
        }
    });
});