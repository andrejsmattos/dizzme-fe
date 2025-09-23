import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { ResponseService } from '../../services/response.service'; // Você precisará criar este serviço
import { SurveyDto } from '../../models/survey.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-public-survey',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './public-survey.component.html',
  styleUrls: ['./public-survey.component.scss']
})
export class PublicSurveyComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly surveyService = inject(SurveyService);
  private readonly responseService = inject(ResponseService);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  public survey: SurveyDto | null = null;
  public isLoading = true;
  public isSubmitting = false;
  public responseForm: FormGroup;

  constructor() {
    this.responseForm = this.fb.group({
      surveyPublicId: ['', Validators.required],
      lgpdConsent: [false, Validators.requiredTrue],
      answers: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    // Pega o 'publicId' da URL da rota
    const publicId = this.route.snapshot.paramMap.get('publicId');

    if (publicId) {
      this.responseForm.patchValue({ surveyPublicId: publicId });
      this.loadSurvey(publicId);
    } else {
      this.isLoading = false;
      this.toastr.error('ID da pesquisa não encontrado na URL.', 'Erro');
    }
  }

  // Carrega os dados da pesquisa da API
  loadSurvey(publicId: string): void {
    this.isLoading = true;
    this.surveyService.getPublicSurvey(publicId).subscribe({
      next: (response) => {
        if (response.success) {
          this.survey = response.data;
          this.buildFormControlsForAnswers();
        } else {
          this.toastr.error(response.message, 'Erro ao carregar pesquisa');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        // O error.interceptor já deve mostrar uma mensagem, mas podemos redirecionar
        this.router.navigate(['/']); // Volta para a home em caso de erro grave
      }
    });
  }

  // Cria os campos de formulário para cada pergunta dinamicamente
  buildFormControlsForAnswers(): void {
    if (!this.survey) return;

    const answersFGs = this.survey.questions.map(question => {
      const validators = question.required ? [Validators.required] : [];
      return this.fb.group({
        questionId: [question.id],
        value: ['', validators]
      });
    });

    this.responseForm.setControl('answers', this.fb.array(answersFGs));
  }

  // Getter para facilitar o acesso ao FormArray no template
  get answers(): FormArray {
    return this.responseForm.get('answers') as FormArray;
  }

  // Submete o formulário
  onSubmit(): void {
    if (this.responseForm.invalid) {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios e aceite os termos.', 'Atenção');
      this.responseForm.markAllAsTouched(); // Mostra os erros de validação
      return;
    }

    this.isSubmitting = true;
    this.responseService.submitResponse(this.responseForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.toastr.success('Obrigado por sua resposta!', 'Enviado com Sucesso');
          // Redireciona para uma página de agradecimento ou para a home
          this.router.navigate(['/thank-you']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        // O error.interceptor já deve tratar a mensagem de erro
      }
    });
  }
}
