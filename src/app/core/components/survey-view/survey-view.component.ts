import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { SurveyDto, SurveySummaryDto } from '../../models/survey.model';
import { ToastrService } from 'ngx-toastr';
import { QRCodeResponse } from '../../models/qrcode.model';
import { QRCodeService } from '../../services/qrcode.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-survey-view',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDropdownModule],
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.scss'],
})
export class SurveyViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly surveyService = inject(SurveyService);
  private readonly qrCodeService = inject(QRCodeService);
  private readonly exportService = inject(ExportService);
  readonly toastr = inject(ToastrService);

  surveyId: number | null = null;
  survey: SurveyDto | null = null;
  isLoading = true;

  selectedSurvey: SurveySummaryDto | null = null;
  qrCodeData: QRCodeResponse | null = null;
  isDeleting = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.surveyId = +id; // O '+' converte a string para número
        this.loadSurveyDetails();
      }
    });
  }

  loadSurveyDetails(): void {
    if (!this.surveyId) return;

    this.isLoading = true;
    this.surveyService.getSurvey(this.surveyId).subscribe({
      next: (response) => {
        if (response.success) {
          this.survey = response.data;
        }
      },
      error: (error) => console.error('Erro ao carregar a pesquisa:', error),
      complete: () => (this.isLoading = false),
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'PUBLICADO';
      case 'DRAFT':
        return 'RASCUNHO';
      case 'ACTIVE':
        return 'ATIVO';
      case 'PAUSED':
        return 'PAUSADO';
      case 'COMPLETED':
        return 'FINALIZADO';
      default:
        return status;
    }
  }

  editSurvey(surveyId: number): void {
    this.router.navigate(['/surveys', surveyId, 'edit']);
  }

  viewStats(surveyId: number): void {
    this.router.navigate(['/surveys', surveyId, 'stats']);
  }

  showQRCode(survey: SurveySummaryDto): void {
    this.selectedSurvey = survey;
    this.qrCodeData = null;
    const publicId = survey.publicUrl.split('/').pop();
    if (publicId) {
      this.qrCodeService.generateSurveyQRCode(publicId, 300).subscribe({
        next: (response) => {
          if (response.success) this.qrCodeData = response.data;
        },
        error: (error) => console.error('Error generating QR code:', error),
      });
    }
  }

  downloadQRCode(): void {
    if (this.qrCodeData && this.selectedSurvey) {
      const link = document.createElement('a');
      link.download = `qr-code-${this.selectedSurvey.title
        .replace(/\s+/g, '-')
        .toLowerCase()}.png`;
      link.href = `data:image/png;base64,${this.qrCodeData.base64Image}`;
      link.click();
    }
  }

  exportCSV(surveyId: number): void {
    this.exportService.exportToCSV(surveyId).subscribe({
      next: (blob) => {
        this.exportService.downloadFile(
          blob,
          `survey-${surveyId}-${Date.now()}.csv`
        );
        this.toastr.success('Exportação CSV concluída!');
      },
      error: () => this.toastr.error('Erro ao exportar CSV.'),
    });
  }

  exportXLSX(surveyId: number): void {
    this.exportService.exportToXLSX(surveyId).subscribe({
      next: (blob) => {
        this.exportService.downloadFile(
          blob,
          `survey-${surveyId}-${Date.now()}.xlsx`
        );
        this.toastr.success('Exportação XLSX concluída!');
      },
      error: () => this.toastr.error('Erro ao exportar XLSX.'),
    });
  }

  copyLink(surveyId?: number): void {
    if (surveyId) {
      const url = `${window.location.origin}/surveys/${surveyId}/view`;
      navigator.clipboard.writeText(url).then(
        () => {
          this.toastr.success('Link copiado para a área de transferência!');
        },
        () => {
          this.toastr.error('Não foi possível copiar o link.');
        }
      );
    }
  }

  shareQRCode(): void {
    if (this.qrCodeData?.base64Image) {
      if (navigator.share) {
        const url = this.selectedSurvey
          ? `${window.location.origin}/surveys/${this.selectedSurvey.id}/view`
          : window.location.origin;
        navigator
          .share({
            title: this.selectedSurvey?.title || 'QR Code',
            text: 'Acesse a pesquisa pelo QR Code',
            url,
          })
          .catch(() => {});
      } else {
        // Fallback: copiar link da pesquisa para a área de transferência
        const url = this.selectedSurvey
          ? `${window.location.origin}/surveys/${this.selectedSurvey.id}/view`
          : window.location.origin;
        navigator.clipboard.writeText(url).then(
          () => {
            this.toastr.success(
              'Link da pesquisa copiado para a área de transferência!'
            );
          },
          () => {
            this.toastr.error('Não foi possível copiar o link.');
          }
        );
      }
    }
  }

  confirmDelete(survey: SurveySummaryDto): void {
    this.selectedSurvey = survey;
  }

  deleteSurvey(): void {
    if (!this.surveyId) return;
    this.isDeleting = true;
    this.surveyService.deleteSurvey(this.surveyId).subscribe({
      next: () => {
        this.toastr.success('Pesquisa excluída com sucesso!');
        this.router.navigate(['/surveys']);
      },
      error: (error) => {
        this.toastr.error('Erro ao excluir pesquisa.');
        console.error('Error deleting survey:', error);
      },
      complete: () => {
        this.isDeleting = false;
      },
    });
  }

  // Add this method to fix the error
  loadSurveys(): void {
    // You should implement the logic to reload the list of surveys here.
    // For now, let's reload the current survey details as a placeholder.
    this.loadSurveyDetails();
  }
}
