import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from '../../services/survey.service';
import { SurveyCreateRequest, SurveyTemplate } from '../../models/survey.model';
import { ApiResponse } from '../../models/api-response.model'
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.scss'],
})
export class NewSurveyComponent implements OnInit {
  newSurveyForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  surveyId?: number;
  surveyTemplates: SurveyTemplate[] = [];
  selectedTemplate: SurveyTemplate | null = null;


  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly surveyService = inject(SurveyService);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly toastr = inject(ToastrService);

  get questions(): FormArray {
    return this.newSurveyForm.get('questions') as FormArray;
  }

  newQuestion(): FormGroup {
    return this.fb.group({
      type: ['RATING', Validators.required],
      text: ['', [Validators.required, Validators.maxLength(200)]],
      options: [''], // Para tipos que usam opções
      required: [false],
      questionOrder: [0],
    });
  }

  addQuestion(): void {
    const order = this.questions.length + 1;
    const q = this.newQuestion();
    q.patchValue({ questionOrder: order });
    this.questions.push(q);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    // Atualiza ordem
    this.questions.controls.forEach((ctrl, i) =>
      ctrl.patchValue({ questionOrder: i + 1 })
    );
  }

  ngOnInit(): void {
    this.newSurveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      questions: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.surveyId = +id;
        this.isLoading = true;
        this.surveyService.getSurvey(this.surveyId).subscribe({
          next: (resp) => {
            if (resp.success && resp.data) {
              this.patchFormWithSurvey(resp.data);
            }
            this.isLoading = false;
          },
          error: () => {
            this.toastr.error('Erro ao carregar pesquisa para edição.');
            this.isLoading = false;
          },
        });
      } else {
        this.addQuestion(); // Novo: começa com uma pergunta
      }
    });

    this.surveyService.getTemplates().subscribe({
      next: (resp: { success: any; data: SurveyTemplate[]; }) => {
        if (resp.success) {
          this.surveyTemplates = resp.data;
        }
      }
    });
  }

  patchFormWithSurvey(survey: any) {
    this.newSurveyForm.patchValue({
      title: survey.title,
      description: survey.description,
    });
    // Limpa perguntas existentes
    while (this.questions.length) {
      this.questions.removeAt(0);
    }
    // Adiciona perguntas existentes
    survey.questions.forEach((q: any) => {
      const qForm = this.fb.group({
        type: [q.type, Validators.required],
        text: [q.text, [Validators.required, Validators.maxLength(200)]],
        options: [q.options ? q.options.join(', ') : ''],
        required: [q.required],
        questionOrder: [q.questionOrder],
      });
      this.questions.push(qForm);
    });
  }

  onSubmit(): void {
    if (this.newSurveyForm.invalid || this.questions.length === 0) {
      this.markFormGroupTouched(this.newSurveyForm);
      this.toastr.warning(
        'Preencha todos os campos obrigatórios corretamente.'
      );
      return;
    }

    this.isLoading = true;
    const rawQuestions = this.questions.value.map((q: any) => {
      let processedOptions: string[] = [];
      if (Array.isArray(q.options)) {
        processedOptions = q.options;
      } else if (typeof q.options === 'string' && q.options.trim() !== '') {
        processedOptions = q.options
          .split(',')
          .map((opt: string) => opt.trim())
          .filter((opt: string) => opt.length > 0);
      }
      return {
        ...q,
        options: processedOptions,
      };
    });

    if (this.isEditMode && this.surveyId) {
      // Atualizar pesquisa existente
      this.surveyService
        .updateSurvey(this.surveyId, {
          title: this.newSurveyForm.value.title,
          description: this.newSurveyForm.value.description,
          questions: rawQuestions,
        })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.toastr.success('Pesquisa atualizada com sucesso!');
              this.router.navigate(['/surveys']);
            } else {
              this.toastr.error(
                response.message || 'Erro ao atualizar pesquisa.'
              );
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Erro ao atualizar pesquisa.');
          },
        });
    } else {
      // Criar nova pesquisa
      const request: SurveyCreateRequest = {
        ...this.newSurveyForm.value,
        questions: rawQuestions,
      };
      this.surveyService.createSurvey(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.toastr.success('Pesquisa criada com sucesso!');
            this.router.navigate(['/surveys']);
          } else {
            this.toastr.error(response.message || 'Erro ao criar pesquisa.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('Erro ao criar pesquisa.');
        },
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  moveQuestionUp(index: number): void {
    if (index <= 0) return;
    const questions = this.questions;
    const current = questions.at(index);
    const above = questions.at(index - 1);
    questions.setControl(index, above);
    questions.setControl(index - 1, current);
    this.updateQuestionOrder();
  }

  moveQuestionDown(index: number): void {
    if (index >= this.questions.length - 1) return;
    const questions = this.questions;
    const current = questions.at(index);
    const below = questions.at(index + 1);
    questions.setControl(index, below);
    questions.setControl(index + 1, current);
    this.updateQuestionOrder();
  }

  updateQuestionOrder(): void {
    this.questions.controls.forEach((ctrl, i) =>
      ctrl.patchValue({ questionOrder: i + 1 })
    );
  }

  onCancelEdit(): void {
    this.router.navigate(['/surveys']);
  }

  applyTemplate(template: SurveyTemplate) {
    this.selectedTemplate = template;
    // Limpe perguntas atuais
    while (this.questions.length) {
      this.questions.removeAt(0);
    }
    // Adicione perguntas do template
    template.questions.forEach(q => {
      this.questions.push(this.fb.group({
        type: [q.type, Validators.required],
        text: [q.text, [Validators.required, Validators.maxLength(200)]],
        options: [q.options || ''],
        required: [q.required],
        questionOrder: [q.questionOrder],
      }));
    });
    // Preencha título e descrição
    this.newSurveyForm.patchValue({
      title: template.name,
      description: template.description
    });
  }

  getSurveyTemplates(): Observable<ApiResponse<SurveyTemplate[]>> {
    return this.http.get<ApiResponse<SurveyTemplate[]>>(`${environment.apiUrl}/templates`);
  }
}
