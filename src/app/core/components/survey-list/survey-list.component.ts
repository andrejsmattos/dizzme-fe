import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveySummaryDto } from '../../models/survey.model';
import { QRCodeResponse } from '../../models/qrcode.model';
import { QRCodeService } from '../../services/qrcode.service';
import { SurveyService } from '../../services/survey.service';
import { ExportService } from '../../services/export.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BsDropdownModule],
})
export class SurveyListComponent implements OnInit {
  surveys: SurveySummaryDto[] = [];
  filteredSurveys: SurveySummaryDto[] = [];
  searchTerm = '';
  statusFilter = '';
  isLoading = true;
  isDeleting = false;

  selectedSurvey: SurveySummaryDto | null = null;
  qrCodeData: QRCodeResponse | null = null;

  constructor(
    private readonly surveyService: SurveyService,
    private readonly qrCodeService: QRCodeService,
    private readonly exportService: ExportService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.isLoading = true;
    this.surveyService.getMySurveys().subscribe({
      next: (response) => {
        if (response.success) {
          this.surveys = response.data;
          this.filteredSurveys = [...this.surveys];
        }
      },
      error: (error) => console.error('Error loading surveys:', error),
      complete: () => (this.isLoading = false),
    });
  }

  filterSurveys(): void {
    this.filteredSurveys = this.surveys.filter((survey) => {
      const matchesSearch =
        !this.searchTerm ||
        survey.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        survey.description
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        !this.statusFilter || survey.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  createNewSurvey(): void {
    this.router.navigate(['/surveys/new']);
  }

  viewSurvey(surveyId: number): void {
    this.router.navigate(['/surveys', surveyId, 'view']);
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
    if (!this.selectedSurvey) return;
    this.isDeleting = true;
    this.surveyService.deleteSurvey(this.selectedSurvey.id).subscribe({
      next: () => this.loadSurveys(),
      error: (error) => console.error('Error deleting survey:', error),
      complete: () => {
        this.isDeleting = false;
        this.selectedSurvey = null;
      },
    });
  }

  getStatusLabel(status: string, active: boolean): string {
    if (!active) return 'INATIVA';
    switch (status) {
      case 'DRAFT':
        return 'RASCUNHO';
      case 'ACTIVE':
        return 'ATIVA';
      case 'PAUSED':
        return 'PAUSADA';
      case 'COMPLETED':
        return 'FINALIZADA';
      default:
        return status;
    }
  }
}
