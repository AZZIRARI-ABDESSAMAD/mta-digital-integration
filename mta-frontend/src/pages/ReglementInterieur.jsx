// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FileText, Download, Printer, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
// import MainLayout from '../components/MainLayout';
// import api from '../api/axios';
// const ReglementInterieur = () => {
//     const [isAccepted, setIsAccepted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();

//     // Chemin du fichier PDF
//     const pdfUrl = "/mta-pdf/reg.pdf";

//     const handleDownload = () => {
//         const link = document.createElement('a');
//         link.href = pdfUrl;
//         link.download = "Reglement_Interieur_MTA.pdf";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const handlePrint = () => {
//         window.open(pdfUrl, '_blank');
//     };

//     const handleValidation = async () => {
//         setIsAccepted(true);
//         setIsSubmitting(true);

//         try {
//             await api.post('/user/progress', { module_slug: 'reglement' });
//             navigate('/formations', { state: { scrollTo: 'reglement' } });
//         } catch (error) {
//             console.error("Erreur de validation:", error);
//             alert("Une erreur est survenue lors de la validation.");
//             setIsAccepted(false);
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <MainLayout>
//             <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-5xl mx-auto">

//                     {/* Indicateur d'étape (Step Progress) */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="flex items-center justify-between mb-6 text-sm font-bold text-slate-500 uppercase tracking-wider"
//                     >
//                         <span>Étape 1 sur 4</span>
//                         <span>Module Suivant: Assemblage</span>
//                     </motion.div>

//                     {/* En-tête de la page */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
//                     >
//                         <div className="flex items-center gap-5">
//                             <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
//                                 <FileText size={32} />
//                             </div>
//                             <div>
//                                 <h1 className="text-3xl font-black text-slate-800 mb-2">Règlement Intérieur</h1>
//                                 <p className="text-slate-500 font-medium">
//                                     Veuillez lire attentivement les règles et procédures internes de MTA Morocco.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex gap-3 w-full md:w-auto">
//                             <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
//                                 <Printer size={18} />
//                                 <span className="hidden sm:inline">Imprimer</span>
//                             </button>
//                             <button onClick={handleDownload} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors">
//                                 <Download size={18} />
//                                 <span>Télécharger</span>
//                             </button>
//                         </div>
//                     </motion.div>

//                     {/* Visionneuse PDF */}
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: 0.1 }}
//                         className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-8 h-[65vh] relative"
//                     >
//                         <iframe
//                             src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
//                             title="Règlement Intérieur MTA"
//                             className="w-full h-full border-0"
//                         />
//                     </motion.div>

//                     {/* Zone de validation */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.2 }}
//                         className={`rounded-3xl p-6 md:p-8 border-2 transition-all duration-300 ${isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'}`}
//                     >
//                         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//                             <div className="flex items-start gap-4">
//                                 {isAccepted ? (
//                                     <CheckCircle size={28} className="text-green-500 shrink-0 mt-1" />
//                                 ) : (
//                                     <AlertCircle size={28} className="text-amber-500 shrink-0 mt-1" />
//                                 )}
//                                 <div>
//                                     <h3 className={`text-xl font-bold mb-1 ${isAccepted ? 'text-green-800' : 'text-slate-800'}`}>
//                                         Confirmation de lecture
//                                     </h3>
//                                     <p className={isAccepted ? 'text-green-600' : 'text-slate-500'}>
//                                         En cliquant sur le bouton, vous confirmez avoir lu et compris le règlement, et passerez à l'étape suivante.
//                                     </p>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleValidation}
//                                 disabled={isAccepted} // كنبلوكيو البوطونة ملي كيكليكي باش ما يعاودش
//                                 className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isAccepted
//                                     ? 'bg-green-600 text-white shadow-lg shadow-green-200 cursor-not-allowed'
//                                     : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md hover:shadow-xl'
//                                     }`}
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <Loader2 size={22} className="animate-spin" />
//                                         Enregistrement...
//                                     </>
//                                 ) : isAccepted ? (
//                                     <>
//                                         Redirection <ArrowRight size={22} className="animate-pulse" />
//                                     </>
//                                 ) : (
//                                     "J'ai lu et j'accepte"
//                                 )}
//                             </button>
//                         </div>
//                     </motion.div>

//                 </div>
//             </div>
//         </MainLayout>
//     );
// };

// export default ReglementInterieur;






import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, CheckCircle, AlertCircle, Loader2, ArrowRight, Trash2, PenTool } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import SignatureCanvas from 'react-signature-canvas';


const ReglementInterieur = () => {
    // all comment in english
    const [isAccepted, setIsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true); // Check if the signature is empty
    const sigCanvas = useRef({}); // The reference of the Canvas
    const navigate = useNavigate();

    const pdfUrl = "/mta-pdf/reg.pdf";

    // Clear the signature
    const clearSignature = () => {
        sigCanvas.current.clear();
        setIsSignatureEmpty(true);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = "Reglement_Interieur_MTA.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.open(pdfUrl, '_blank');
    };

    const handleValidation = async () => {
        // 1. Check if the signature is empty
        if (sigCanvas.current.isEmpty()) {
            alert("Veuillez signer avant d'accepter le règlement.");
            return;
        }

        try {
            // The solution here: we used getCanvas() instead of getTrimmedCanvas()
            const signatureData = sigCanvas.current.getCanvas().toDataURL('image/png');

            console.log("Signature captured successfully!");
            setIsSubmitting(true);

            const response = await api.post('/user/progress', {
                module_slug: 'reglement',
                signature: signatureData
            });

            setIsAccepted(true);

            setTimeout(() => {
                navigate('/formations', { state: { scrollTo: 'reglement' } });
            }, 500);

        } catch (error) {
            console.error("Détails de l'erreur:", error.response?.data || error.message);
            alert("Une erreur est survenue lors de l'enregistrement.");
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-official">
                <div className="max-w-5xl mx-auto">

                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
                        <span>Étape 1 sur 4</span>
                        <span>Module Suivant: Assemblage</span>
                    </motion.div>

                    {/* En-tête */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 mb-2">Règlement Intérieur</h1>
                                <p className="text-slate-500 font-medium italic">Lu et Approuvé</p>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                <Printer size={18} />
                            </button>
                            <button onClick={handleDownload} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors">
                                <Download size={18} />
                                <span>Télécharger</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* PDF Viewer */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-8 h-[65vh] relative">
                        <iframe src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} title="Règlement Intérieur MTA" className="w-full h-full border-0" />
                    </motion.div>

                    {/* Zone de Signature et Validation */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl p-6 md:p-10 border-2 transition-all duration-500 ${isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                            {/* The signature side */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-800 font-black uppercase text-sm tracking-widest">
                                        <PenTool size={18} className="text-blue-600" />
                                        Digital Signature
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 size={14} /> Effacer
                                    </button>
                                </div>

                                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden relative group">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor='black'
                                        onBegin={() => setIsSignatureEmpty(false)}
                                        canvasProps={{
                                            className: "w-full h-48 cursor-crosshair"
                                        }}
                                    />
                                    {isSignatureEmpty && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-medium italic opacity-50">
                                            Signez ici...
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold text-center tracking-tighter">Cette signature a une valeur juridique interne</p>
                            </div>

                            {/* The validation side */}
                            <div className="flex flex-col justify-center space-y-6 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-10">
                                <div className="flex items-start gap-4">
                                    {isAccepted ? <CheckCircle size={28} className="text-green-500 shrink-0" /> : <AlertCircle size={28} className="text-amber-500 shrink-0" />}
                                    <div>
                                        <h3 className={`text-xl font-black mb-1 ${isAccepted ? 'text-green-800' : 'text-slate-800'}`}>Engagement</h3>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            En signant et validant, je certifie avoir pris connaissance du règlement intérieur de <strong>MTA Morocco</strong> et m'engage à le respecter.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleValidation}
                                    disabled={isAccepted || isSignatureEmpty}
                                    className={`w-full px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isAccepted
                                        ? 'bg-green-600 text-white cursor-not-allowed shadow-lg'
                                        : isSignatureEmpty
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-mtaBlue hover:bg-blue-900 text-white shadow-xl hover:-translate-y-1 active:scale-95'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 size={22} className="animate-spin" /> Enregistrement...</>
                                    ) : isAccepted ? (
                                        <><CheckCircle size={22} /> Validé</>
                                    ) : (
                                        <>Confirmer et Signer <ArrowRight size={22} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </MainLayout>
    );
};

export default ReglementInterieur;