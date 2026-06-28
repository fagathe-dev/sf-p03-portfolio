<?php

declare(strict_types=1);
namespace App\Controller;

use App\Service\HomepageDataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

#[Route('', name: 'app_home_')]
final class HomeController extends AbstractController
{
    #[Route(path: '', name: 'index', methods: ['GET'])]
    public function index(HomepageDataService $dataService): Response
    {
        
        return $this->render('pages/homepage.html.twig', [
            'seo' => $dataService->getSeo(),
            'profile' => $dataService->getProfile(),
            'skills' => $dataService->getSkills(),
            'projects' => $dataService->getProjects(),
            'timeline' => $dataService->getTimeline(),
        ]);
    }

    #[Route(path: '/mentions-legales', name: 'legal', methods: ['GET'])]
    public function legal(HomepageDataService $dataService): Response
    {
        return $this->render('pages/legales.html.twig', [
            'profile' => $dataService->getProfile(),
            'skills' => $dataService->getSkills(),
            'projects' => $dataService->getProjects(),
            'timeline' => $dataService->getTimeline(),
        ]);
    }

    #[Route(path: '/telecharger-mon-cv', name: 'download_resume', methods: ['GET'])]
    public function downloadResume(#[Autowire('%kernel.project_dir%')] string $projectDir): BinaryFileResponse
    {
        // 1. Chemin vers ton CV dans le dossier data (hors du dossier public)
        $filePath = $projectDir . '/public/assets/files/cv_agathe_frederick.pdf';

        if (!file_exists($filePath)) {
            throw $this->createNotFoundException('Le fichier CV est introuvable.');
        }

        // 2. Création de la réponse binaire optimisée
        $response = new BinaryFileResponse($filePath);

        // 3. Configuration du header pour forcer le téléchargement avec un nom SEO/Propre
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            'CV_Agathe_Frederick_Developpeur_PHP.pdf' // Le nom du fichier tel qu'il sera téléchargé par le recruteur
        );

        return $response;
    }
}
